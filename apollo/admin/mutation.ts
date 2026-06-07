import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberUpdate!) {
		updateMemberByAdmin(input: $input) {
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

/**************************
 *        HOSPITAL        *
 *************************/

export const UPDATE_HOSPITAL_BY_ADMIN = gql`
	mutation UpdateHospitalByAdmin($input: HospitalUpdate!) {
		updateHospitalByAdmin(input: $input) {
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

export const REMOVE_HOSPITAL_BY_ADMIN = gql`
	mutation RemoveHospitalByAdmin($input: String!) {
		removeHospitalByAdmin(hospitalId: $input) {
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

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
		updateBoardArticleByAdmin(input: $input) {
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

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation RemoveBoardArticleByAdmin($input: String!) {
		removeBoardArticleByAdmin(articleId: $input) {
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

export const REMOVE_COMMENT_BY_ADMIN = gql`
	mutation RemoveCommentByAdmin($input: String!) {
		removeCommentByAdmin(commentId: $input) {
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
