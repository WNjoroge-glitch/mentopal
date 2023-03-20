import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Avatar = styled.div`

width:75px;
height:75px;
border-radius:50%;
`

export const AuthContainer = styled.div`
background-color:#3B5998;
min-height:100vh;




`
export const StyledLink = styled(Link)`
text-decoration:none;
color:black;
`

export const Content = styled.div`
// background-color: #D64933;
position:relative;


`
export const Wave = styled.div`


// position: absolute;
// top: 0;
// left: 0;
// width: 100%;
// overflow: hidden;
// line-height: 0;
// margin-bottom:30px;


`




export const AuthForm = styled.form`
display:flex;
flex-direction:column;
align-items:center;


`

export const AuthInput = styled.input`
background-color :#EE5E9;
border-radius:5px;
outline:none;
border:none;
padding:10px 40px;
margin:10px 0;
`

export const AuthSubmit = styled.button`
background-color:#EE5E9;
padding:10px 25px;
border-radius:5px;
outline:none;
border:none;
cursor:pointer;
&:hover{
    background-color:#D64933;
}
&:active{
    outline:1px solid black;
    border:1px solid black;
}
`

