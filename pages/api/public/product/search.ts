import { NextApiRequest, NextApiResponse } from 'next'
import { METHOD, STATUS_CODE } from '@/const/app-const'
import searchProductPublic from '@/Server/Modules/Public/Product/search'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	let response: any
	if (req.method === METHOD.GET) {
		response = await searchProductPublic(req)
	}

	if (response) {
		return res.status(STATUS_CODE.OK).json(response)
	}
	return res.status(STATUS_CODE.INVALID_METHOD).json({ ok: false, data: null, msg: 'Internal server' })
}
