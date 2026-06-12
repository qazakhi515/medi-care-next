import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const SIGN_UP = gql`
	mutation Signup($input: MemberInput!) {
		signup(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberWarnings
			memberBlocks
			memberHospitals
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberWarnings
			memberBlocks
			memberHospitals
			memberRank
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const UPDATE_MEMBER = gql`
	mutation UpdateMember($input: MemberUpdate!) {
		updateMember(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberHospitals
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const LIKE_TARGET_MEMBER = gql`
	mutation LikeTargetMember($input: String!) {
		likeTargetMember(memberId: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberWarnings
			memberBlocks
			memberHospitals
			memberRank
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

/**************************
 *        HOSPITAL        *
 *************************/

export const CREATE_HOSPITAL = gql`
	mutation CreateHospital($input: HospitalInput!) {
		createHospital(input: $input) {
			_id
			hospitalType
			hospitalStatus
			hospitalLocation
			hospitalAddress
			hospitalTitle
			hospitalPrice
			hospitalSquare
			hospitalBeds
			hospitalRooms
			hospitalViews
			hospitalLikes
			hospitalImages
			hospitalDesc
			hospitalBarter
			hospitalRent
			memberId
			deletedAt
			constructedAt
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_HOSPITAL = gql`
	mutation UpdateHospital($input: HospitalUpdate!) {
		updateHospital(input: $input) {
			_id
			hospitalType
			hospitalStatus
			hospitalLocation
			hospitalAddress
			hospitalTitle
			hospitalPrice
			hospitalSquare
			hospitalBeds
			hospitalRooms
			hospitalViews
			hospitalLikes
			hospitalImages
			hospitalDesc
			hospitalBarter
			hospitalRent
			memberId
			deletedAt
			constructedAt
			createdAt
			updatedAt
		}
	}
`;

export const LIKE_TARGET_HOSPITAL = gql`
	mutation LikeTargetHospital($input: String!) {
		likeTargetHospital(hospitalId: $input) {
			_id
			hospitalType
			hospitalStatus
			hospitalLocation
			hospitalAddress
			hospitalTitle
			hospitalPrice
			hospitalSquare
			hospitalBeds
			hospitalRooms
			hospitalViews
			hospitalLikes
			hospitalImages
			hospitalDesc
			hospitalBarter
			hospitalRent
			memberId
			deletedAt
			constructedAt
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const CREATE_BOARD_ARTICLE = gql`
	mutation CreateBoardArticle($input: BoardArticleInput!) {
		createBoardArticle(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_BOARD_ARTICLE = gql`
	mutation UpdateBoardArticle($input: BoardArticleUpdate!) {
		updateBoardArticle(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const LIKE_TARGET_BOARD_ARTICLE = gql`
	mutation LikeTargetBoardArticle($input: String!) {
		likeTargetBoardArticle(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const CREATE_COMMENT = gql`
	mutation CreateComment($input: CommentInput!) {
		createComment(input: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_COMMENT = gql`
	mutation UpdateComment($input: CommentUpdate!) {
		updateComment(input: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         FOLLOW        *
 *************************/

export const SUBSCRIBE = gql`
	mutation Subscribe($input: String!) {
		subscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;

export const UNSUBSCRIBE = gql`
	mutation Unsubscribe($input: String!) {
		unsubscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         DOCTOR         *
 *************************/

export const CREATE_DOCTOR = gql`
	mutation CreateDoctor($input: DoctorInput!) {
		createDoctor(input: $input) {
			_id
			memberId
			hospitalId
			doctorStatus
			specialization
			licenseNumber
			experienceYears
			consultationFee
			education
			certificates
			createdAt
		}
	}
`;

export const UPDATE_DOCTOR = gql`
	mutation UpdateDoctor($input: DoctorUpdate!) {
		updateDoctor(input: $input) {
			_id
			memberId
			hospitalId
			doctorStatus
			specialization
			licenseNumber
			experienceYears
			consultationFee
			education
			certificates
			updatedAt
		}
	}
`;

/**************************
 *     DOCTOR-SCHEDULE    *
 *************************/

export const CREATE_DOCTOR_SCHEDULE = gql`
	mutation CreateDoctorSchedule($input: DoctorScheduleInput!) {
		createDoctorSchedule(input: $input) {
			_id
			doctorId
			scheduleStatus
			dayOfWeek
			startTime
			endTime
			slotDuration
			createdAt
		}
	}
`;

export const UPDATE_DOCTOR_SCHEDULE = gql`
	mutation UpdateDoctorSchedule($input: DoctorScheduleUpdate!) {
		updateDoctorSchedule(input: $input) {
			_id
			doctorId
			scheduleStatus
			dayOfWeek
			startTime
			endTime
			slotDuration
			updatedAt
		}
	}
`;

export const REMOVE_DOCTOR_SCHEDULE = gql`
	mutation RemoveDoctorSchedule($input: String!) {
		removeDoctorSchedule(scheduleId: $input) {
			_id
			doctorId
			scheduleStatus
		}
	}
`;

/**************************
 *       APPOINTMENT      *
 *************************/

export const CREATE_APPOINTMENT = gql`
	mutation CreateAppointment($input: AppointmentInput!) {
		createAppointment(input: $input) {
			_id
			patientId
			doctorId
			appointmentDate
			startTime
			endTime
			symptoms
			appointmentStatus
			appointmentReason
			createdAt
		}
	}
`;

export const UPDATE_APPOINTMENT = gql`
	mutation UpdateAppointment($input: AppointmentUpdate!) {
		updateAppointment(input: $input) {
			_id
			appointmentStatus
			appointmentDate
			startTime
			endTime
			symptoms
			cancellationReason
			updatedAt
		}
	}
`;

/**************************
 *        PAYMENT         *
 *************************/

export const CREATE_PAYMENT = gql`
	mutation CreatePayment($input: PaymentInput!) {
		createPayment(input: $input) {
			_id
			appointmentId
			patientId
			doctorId
			paymentStatus
			amount
			paymentMethod
			paidAt
			createdAt
		}
	}
`;

/**************************
 *    PATIENT-PROFILE     *
 *************************/

export const CREATE_PATIENT_PROFILE = gql`
	mutation CreatePatientProfile($input: PatientProfileInput!) {
		createPatientProfile(input: $input) {
			_id
			memberId
			birthDate
			gender
			bloodType
			chronicDiseases
			emergencyContact
			createdAt
		}
	}
`;

export const UPDATE_PATIENT_PROFILE = gql`
	mutation UpdatePatientProfile($input: PatientProfileUpdate!) {
		updatePatientProfile(input: $input) {
			_id
			memberId
			birthDate
			gender
			bloodType
			chronicDiseases
			emergencyContact
			updatedAt
		}
	}
`;

/**************************
 *     FORGOT PASSWORD    *
 *************************/

export const FORGOT_PASSWORD = gql`
	mutation ForgotPassword($input: ForgotPasswordInput!) {
		forgotPassword(input: $input)
	}
`;

export const RESET_PASSWORD = gql`
	mutation ResetPassword($input: ResetPasswordInput!) {
		resetPassword(input: $input)
	}
`;

/**************************
 *      NOTIFICATION      *
 *************************/

export const UPDATE_NOTIFICATION = gql`
	mutation UpdateNotification($input: NotificationUpdate!) {
		updateNotification(input: $input) {
			_id
			notificationStatus
		}
	}
`;
