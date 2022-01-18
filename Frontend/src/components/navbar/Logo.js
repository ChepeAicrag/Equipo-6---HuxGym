import {Link} from 'react-router-dom';
import styled from 'styled-components';
import { breakpoints as bp} from "../navbar/GlobalStyle";

const StyleLink = styled(Link)`
    font-size: var(--fsize-7);
    font-weight: 700;
    color: rgb(255,255,255);
    min-height: 48px;
    display: flex;
    align-items: center;
    padding: 20px 20px 20px 25px;
`;

function Logo(props){
    return <h1>
        <StyleLink >HuxGym<span></span></StyleLink>
    </h1>
}
export default Logo;