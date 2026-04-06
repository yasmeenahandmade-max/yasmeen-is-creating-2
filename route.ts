import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/utils';

// POST — Place a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, customerAddress, paymentMethod, items } = body;

    if (!customerName || !customerEmail || !customerPhone || !paymentMethod || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate items and calculate total
    let total = 0;
    const orderItems: { productId: string; titleEn: string; titleAr: string; quantity: number; price: number }[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId, isPublished: true },
      });

      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
      }

      // Check stock for physical products
      if (product.productType === 'PHYSICAL' && product.stockQuantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${product.titleEn}". Available: ${product.stockQuantity}` },
          { status: 400 }
        );
      }

      const price = product.price.toNumber();
      total += price * item.quantity;

      orderItems.push({
        productId: product.id,
        titleEn: product.titleEn,
        titleAr: product.titleAr,
        quantity: item.quantity,
        price,
      });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName,
        customerEmail,
        customerPhone,
        customerAddress: customerAddress || null,
        total,
        paymentMethod,
        paymentStatus: 'PENDING',
        orderStatus: 'NEW',
        items: {
          create: orderItems,
        },
      },
      include: { items: true },
    });

    // Decrease stock for physical products
    for (const item of orderItems) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (product?.productType === 'PHYSICAL') {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }
    }

    // Create notification for admins
    const admins = await prisma.user.findMany({ select: { id: true } });
    await prisma.notification.createMany({
      data: admins.map((admin) => ({
        userId: admin.id,
        type: 'NEW_ORDER' as const,
        title: `New Order #${order.orderNumber}`,
        message: `${customerName} placed an order for ${total.toFixed(2)} JOD`,
        link: `/admin/orders`,
      })),
    });

    return NextResponse.json({
      order: {
        ...order,
        total: order.total.toNumber(),
        items: order.items.map((i) => ({ ...i, price: i.price.toNumber() })),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Place order error:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}

// GET — Track order by order number
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get('orderNumber');

  if (!orderNumber) {
    return NextResponse.json({ error: 'orderNumber is required' }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({
    order: {
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      total: order.total.toNumber(),
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((i) => ({
        titleEn: i.titleEn,
        titleAr: i.titleAr,
        quantity: i.quantity,
        price: i.price.toNumber(),
      })),
    },
  });
}
