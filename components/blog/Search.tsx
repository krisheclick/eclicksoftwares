import { Form, FormControl, InputGroup } from "react-bootstrap";
import Styles from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
const SearchBox = () => {
    return (
        <div className={`${Styles.widget} ${Styles.recent_posts ?? ''}`}>
            <div className={Styles.widget_title}>Search</div>
            <Form className={Styles.searchBox}>
                <InputGroup>
                    <FormControl className={Styles.formInput} type="text" placeholder="Enter Search Keyword" />
                </InputGroup>
                <button className={Styles.searchBtn}><FontAwesomeIcon icon={faSearch} /></button>
            </Form>
        </div>
    )
}
export default SearchBox;