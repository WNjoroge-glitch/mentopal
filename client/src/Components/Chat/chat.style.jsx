import styled from 'styled-components';


export const ChatContainer = styled.div`
background-color:rgb(59,89,152,25%);

min-height:100vh;
width:100%;

`


export const MessagesDiv = styled.div`
display:flex;
flex-direction:coumn;
overflow-y:scroll;
scrollbar-width:none;

`

export const InputField = styled.input`
border-radius:10px;
width:60%;
outline:none;

padding: 15px 0;
`
export const Input = styled.div`
position:sticky;
bottom:0;
`
export const MessageHeader = styled.div`
background-color:#D64933;
display:flex;
justify-content:space-between;
align-items:center;
`