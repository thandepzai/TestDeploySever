import { NextApiRequest } from 'next'

import { prisma } from '@/services/prisma'

interface BodyProps {
	orderId: string
	status: string
}
export default async function canceledOrder(req: NextApiRequest) {
	const { orderId, status } = JSON.parse(req.body) as BodyProps
	console.log('🚀 ~ file: canceled.ts:11 ~ canceledOrder ~ orderId:', orderId)
	try {
		const existingOrder = await prisma.order.findUnique({
			where: { id: Number(orderId) }
		})

		if (existingOrder?.status === 'CANCELED') {
			return {
				ok: false,
				data: null,
				msg: `Đơn hàng  ${orderId} đã được hủy rồi`
			}
		}

		const listOrderItem = await prisma.orderProduct.findMany({
			where: { orderId: Number(orderId) }
		})

		await Promise.all(
			listOrderItem.map(async item => {
				await prisma.sizeProduct.update({
					where: { id: item.sizeProductId },
					data: {
						quantity: {
							increment: item.quantity
						}
					}
				})
			})
		)

		const paymentOrder = await prisma.orderPayment.findUnique({
			where: { orderId: Number(orderId) }
		})

		const checkStatus =
			paymentOrder?.method === 'online' && existingOrder?.status !== 'REFUND' ? 'REFUND' : 'CANCELED'

		const updateOrder = await prisma.order.update({
			where: { id: Number(orderId) },
			data: { status: checkStatus }
		})

		return {
			ok: true,
			data: updateOrder,
			msg: `Hủy đơn hàng thành công`
		}
	} catch (error) {
		console.log('🚀 ~ file: canceled.ts:50 ~ editOrder ~ error:', error)
		return null
	}
}
