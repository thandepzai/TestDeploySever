import { useAntdTable } from 'ahooks'
import { Button, Table, Tooltip } from 'antd'
import { useTable } from '../hooks/useTable'
import { EditOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import { ORDER_ROUTER } from '../../configs/router'

export default () => {
	const router = useRouter()
	const { getTableData, setFilterStatus } = useTable()
	let { tableProps, search } = useAntdTable(getTableData)
	const { submit } = search
	tableProps = {
		...tableProps,
		onChange: (pagination, filters) => {
			setFilterStatus(filters.status)
			submit()
		}
	}

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id'
		},
		{
			title: 'Code',
			dataIndex: 'code'
		},
		{
			title: 'Tên khác hàng',
			dataIndex: ['orderCustomerInfo', 'name']
		},
		{
			title: 'Số điện thoại',
			dataIndex: ['orderCustomerInfo', 'phone']
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			filters: [
				{ text: 'Chờ Duyệt', value: 'WAITING' },
				{ text: 'Hoàn Tiền', value: 'REFUND' },
				{ text: 'Chấp nhận', value: 'CONFIRM' },
				{ text: 'Đang Giao', value: 'SHIPPING' },
				{ text: 'Đã Hủy', value: 'CANCELED' },
				{ text: 'Hoàn Thành', value: 'DONE' }
			],
			filterMultiple: false
		},
		{
			title: 'Hành động',
			dataIndex: '',
			render: (data: any) => {
				console.log(data)
				return (
					<div className="flex flex-col gap-2">
						<Tooltip placement="topLeft" title={'Chỉnh sửa'}>
							<Button
								style={{ width: '25%' }}
								className="flex justify-center items-center"
								type="primary"
								color="success"
								onClick={() => router.push(ORDER_ROUTER.DETAIL(data?.id))}
							>
								<EditOutlined />
							</Button>
						</Tooltip>
					</div>
				)
			}
		}
	]
	return <Table columns={columns} rowKey="id" {...tableProps} />
}
