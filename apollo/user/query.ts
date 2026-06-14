import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_AGENTS = gql`
	query GetAgents($input: AgentsInquiry!) {
		getAgents(input: $input) {
			list {
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
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER = gql(`
query GetMember($input: String!) {
    getMember(memberId: $input) {
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
        memberArticles
        memberPoints
        memberLikes
        memberViews
        memberFollowings
				memberFollowers
        memberRank
        memberWarnings
        memberBlocks
        deletedAt
        createdAt
        updatedAt
        accessToken
        meFollowed {
					followingId
					followerId
				}
    }
}
`);

/**************************
 *        HOSPITAL        *
 *************************/

export const GET_HOSPITAL = gql`
	query GetHospital($input: String!) {
		getHospital(hospitalId: $input) {
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
			memberData {
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
				memberPoints
				memberLikes
				memberViews
				deletedAt
				createdAt
				updatedAt
				accessToken
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const GET_HOSPITALS = gql`
	query GetHospitals($input: HospitalsInquiry!) {
		getHospitals(input: $input) {
			list {
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
				hospitalRank
				hospitalImages
				hospitalDesc
				hospitalBarter
				hospitalRent
				memberId
				deletedAt
				constructedAt
				createdAt
				updatedAt
				memberData {
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
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_AGENT_HOSPITALS = gql`
	query GetAgentHospitals($input: AgentHospitalsInquiry!) {
		getAgentHospitals(input: $input) {
			list {
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
			metaCounter {
				total
			}
		}
	}
`;

export const GET_FAVORITES = gql`
	query GetFavorites($input: OrdinaryInquiry!) {
		getFavorites(input: $input) {
			list {
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
				hospitalComments
				hospitalRank
				hospitalImages
				hospitalDesc
				hospitalBarter
				hospitalRent
				memberId
				deletedAt
				constructedAt
				createdAt
				updatedAt
				memberData {
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
					memberArticles
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_VISITED = gql`
	query GetVisited($input: OrdinaryInquiry!) {
		getVisited(input: $input) {
			list {
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
				hospitalComments
				hospitalRank
				hospitalImages
				hospitalDesc
				hospitalBarter
				hospitalRent
				memberId
				deletedAt
				constructedAt
				createdAt
				updatedAt
				memberData {
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
					memberArticles
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_BOARD_ARTICLE = gql`
	query GetBoardArticle($input: String!) {
		getBoardArticle(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			articleComments
			memberId
			createdAt
			updatedAt
			memberData {
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
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const GET_BOARD_ARTICLES = gql`
	query GetBoardArticles($input: BoardArticlesInquiry!) {
		getBoardArticles(input: $input) {
			list {
				_id
				articleCategory
				articleStatus
				articleTitle
				articleContent
				articleImage
				articleViews
				articleLikes
				articleComments
				memberId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				memberData {
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
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const GET_COMMENTS = gql`
	query GetComments($input: CommentsInquiry!) {
		getComments(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentContent
				commentRefId
				memberId
				createdAt
				updatedAt
				memberData {
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
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         FOLLOW        *
 *************************/
export const GET_MEMBER_FOLLOWERS = gql`
	query GetMemberFollowers($input: FollowInquiry!) {
		getMemberFollowers(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
				}
				followerData {
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
					memberArticles
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER_FOLLOWINGS = gql`
	query GetMemberFollowings($input: FollowInquiry!) {
		getMemberFollowings(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				followingData {
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
					memberArticles
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         DOCTOR         *
 *************************/

export const GET_DOCTOR = gql`
	query GetDoctor($input: String!) {
		getDoctor(doctorId: $input) {
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
			doctorRank
			doctorViews
			createdAt
			updatedAt
			memberData {
				_id
				memberType
				memberNick
				memberFullName
				memberImage
				memberPhone
				memberAddress
				memberDesc
			}
		}
	}
`;

export const GET_DOCTORS = gql`
	query GetDoctors($input: DoctorsInquiry!) {
		getDoctors(input: $input) {
			list {
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
				doctorRank
				doctorViews
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberNick
					memberFullName
					memberImage
					memberPhone
					memberAddress
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *     DOCTOR-SCHEDULE    *
 *************************/

export const GET_DOCTOR_SCHEDULES = gql`
	query GetDoctorSchedules($input: DoctorSchedulesInquiry!) {
		getDoctorSchedules(input: $input) {
			list {
				_id
				doctorId
				scheduleStatus
				dayOfWeek
				startTime
				endTime
				slotDuration
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *       APPOINTMENT      *
 *************************/

export const GET_APPOINTMENT = gql`
	query GetAppointment($input: String!) {
		getAppointment(appointmentId: $input) {
			_id
			patientId
			doctorId
			appointmentDate
			startTime
			endTime
			symptoms
			appointmentStatus
			appointmentReason
			cancellationReason
			createdAt
			updatedAt
			doctorData {
				_id
				specialization
				consultationFee
				memberData {
					_id
					memberNick
					memberFullName
					memberImage
				}
			}
			patientData {
				_id
				memberNick
				memberFullName
				memberImage
			}
		}
	}
`;

export const GET_APPOINTMENTS = gql`
	query GetAppointments($input: AppointmentsInquiry!) {
		getAppointments(input: $input) {
			list {
				_id
				patientId
				doctorId
				appointmentDate
				startTime
				endTime
				symptoms
				appointmentStatus
				appointmentReason
				cancellationReason
				createdAt
				updatedAt
				doctorData {
					_id
					specialization
					consultationFee
					memberData {
						_id
						memberNick
						memberFullName
						memberImage
					}
				}
				patientData {
					_id
					memberNick
					memberFullName
					memberImage
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *        PAYMENT         *
 *************************/

export const GET_PAYMENTS = gql`
	query GetPayments($input: PaymentsInquiry!) {
		getPayments(input: $input) {
			list {
				_id
				appointmentId
				patientId
				doctorId
				paymentStatus
				amount
				paymentMethod
				paidAt
				createdAt
				updatedAt
				doctorData {
					_id
					specialization
					memberData {
						_id
						memberNick
						memberFullName
					}
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *    PATIENT-PROFILE     *
 *************************/

export const GET_PATIENT_PROFILE = gql`
	query GetPatientProfile {
		getPatientProfile {
			_id
			memberId
			birthDate
			gender
			bloodType
			chronicDiseases
			emergencyContact
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *      NOTIFICATION      *
 *************************/

export const GET_NOTIFICATIONS = gql`
	query GetNotifications($input: NotificationsInquiry!) {
		getNotifications(input: $input) {
			list {
				_id
				notificationType
				notificationStatus
				notificationGroup
				notificationTitle
				notificationDesc
				authorId
				receiverId
				createdAt
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *   DOCTOR AVAILABILITY  *
 *************************/

export const GET_DOCTOR_AVAILABILITY = gql`
	query GetDoctorAvailability($input: DoctorAvailabilityInput!) {
		getDoctorAvailability(input: $input) {
			doctorId
			date
			isWorkingDay
			slots {
				startTime
				endTime
			}
		}
	}
`;
