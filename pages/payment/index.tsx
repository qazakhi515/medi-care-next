import React, { useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Typography, Button, Divider, Chip, MenuItem, Select } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import Moment from 'react-moment';
import { GET_APPOINTMENTS, GET_PAYMENTS } from '../../apollo/user/query';
import { CREATE_PAYMENT } from '../../apollo/user/mutation';
import { Appointment } from '../../libs/types/appointment/appointment';
import { Payment } from '../../libs/types/payment/payment';
import { AppointmentStatus } from '../../libs/enums/appointment.enum';
import { PaymentMethod } from '../../libs/enums/payment.enum';
import { userVar } from '../../apollo/store';
import { Messages } from '../../libs/config';
import { formatterStr } from '../../libs/utils';
import { sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../libs/sweetAlert';
import { T } from '../../libs/types/common';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const PaymentPage: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [payments, setPayments] = useState<Payment[]>([]);
	const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.CARD);

	/** APOLLO REQUESTS **/
	useQuery(GET_APPOINTMENTS, {
		fetchPolicy: 'network-only',
		variables: { input: { page: 1, limit: 50, sort: 'appointmentDate', direction: 'DESC', search: {} } },
		skip: !user?._id,
		onCompleted: (data: T) => setAppointments(data?.getAppointments?.list ?? []),
	});

	const { refetch: refetchPayments } = useQuery(GET_PAYMENTS, {
		fetchPolicy: 'network-only',
		variables: { input: { page: 1, limit: 50, sort: 'createdAt', direction: 'DESC', search: {} } },
		skip: !user?._id,
		onCompleted: (data: T) => setPayments(data?.getPayments?.list ?? []),
	});

	const [createPayment] = useMutation(CREATE_PAYMENT);

	const paidAppointmentIds = new Set(payments.map((p) => p.appointmentId));
	const payableAppointments = appointments.filter(
		(a) => a.appointmentStatus !== AppointmentStatus.CANCELLED && !paidAppointmentIds.has(a._id),
	);

	/** HANDLERS **/
	const payHandler = async (appointmentId: string) => {
		try {
			if (!user?._id) throw new Error(Messages.error2);
			await createPayment({
				variables: { input: { appointmentId, paymentMethod: method } },
			});
			await sweetMixinSuccessAlert('Payment successful!');
			await refetchPayments();
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') return <h1>PAYMENTS MOBILE</h1>;

	return (
		<Stack sx={{ maxWidth: 1000, margin: '0 auto', py: 5, px: 2 }} spacing={4}>
			<Stack sx={{ background: '#fff', p: 4, borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} spacing={2}>
				<Stack direction="row" justifyContent="space-between" alignItems="center">
					<Typography variant="h5" sx={{ fontWeight: 700 }}>
						Pending payments
					</Typography>
					<div>
						<Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
							Method
						</Typography>
						<Select size="small" value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
							{Object.values(PaymentMethod).map((m) => (
								<MenuItem key={m} value={m}>
									{m}
								</MenuItem>
							))}
						</Select>
					</div>
				</Stack>
				<Divider />
				{!user?._id ? (
					<Typography color="text.secondary">Please log in to manage payments.</Typography>
				) : payableAppointments.length === 0 ? (
					<Typography color="text.secondary">No pending payments.</Typography>
				) : (
					payableAppointments.map((a) => (
						<Stack key={a._id} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2, border: '1px solid #eee', borderRadius: '8px' }}>
							<Stack>
								<Typography sx={{ fontWeight: 600 }}>
									{a.doctorData?.memberData?.memberFullName || a.doctorData?.memberData?.memberNick || 'Doctor'}
									{a.doctorData?.specialization ? ` · ${a.doctorData.specialization}` : ''}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									<Moment format="DD MMM YYYY">{a.appointmentDate}</Moment> · {a.startTime}
									{a.doctorData?.consultationFee ? ` · $${formatterStr(a.doctorData.consultationFee)}` : ''}
								</Typography>
							</Stack>
							<Button variant="contained" onClick={() => payHandler(a._id)}>
								Pay now
							</Button>
						</Stack>
					))
				)}
			</Stack>

			<Stack sx={{ background: '#fff', p: 4, borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} spacing={2}>
				<Typography variant="h5" sx={{ fontWeight: 700 }}>
					Payment history
				</Typography>
				<Divider />
				{payments.length === 0 ? (
					<Typography color="text.secondary">No payments yet.</Typography>
				) : (
					payments.map((p) => (
						<Stack key={p._id} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2, border: '1px solid #eee', borderRadius: '8px' }}>
							<Stack>
								<Typography sx={{ fontWeight: 600 }}>{formatterStr(p.amount)} sum</Typography>
								<Typography variant="body2" color="text.secondary">
									{p.paymentMethod} · <Moment format="DD MMM YYYY">{p.createdAt}</Moment>
								</Typography>
							</Stack>
							<Chip
								label={p.paymentStatus}
								size="small"
								color={p.paymentStatus === 'PAID' ? 'success' : 'default'}
							/>
						</Stack>
					))
				)}
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(PaymentPage);
