import { gql } from '@apollo/client'

export const  GET_AUTHENTICATED_USER = gql`
    query GetAuthenticatedUser {
        authUser {
            _id
            username
            name
            gender
            profilePicture
        }
    }
`;

export const GET_USER_AND_TRANSACTIONS = gql`
    query GetUserAndTractions($userId: ID!) {
        user(userId: $userId) {
            _id
            name
            username
            profilePicture
            transactions {
                _id
                description
                paymentType
                category
                amount
                location
                date
            }
        }
    }
`;