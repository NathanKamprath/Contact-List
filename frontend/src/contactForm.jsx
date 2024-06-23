import {useState} from "react"

const ContactForm = ({existingContact = {}, updateContact}) => {
    const [firstName, setFirstName] = useState(existingContact.firstName || "");
    const [lastName, setLastName] = useState(existingContact.lastName || "");
    const [email, setEmail] = useState(existingContact.email || "");
    const [phoneNum, setPhoneNum] = useState(existingContact.phoneNum || "");

    const updating = Object.entries(existingContact).length !== 0;

    const onSubmit = async (evt) => {
        evt.preventDefault();

        const data = {
            firstName,
            lastName,
            email,
            phoneNum
        };
        const url = "http://127.0.0.1:5000/" + (updating ? `update_contact/${existingContact.id}` : "create_contact");
        const options = {
            method: updating ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        };
        const response = await fetch (url, options);

        if (response.status !== 201 && response.status !== 200) {
            const datum = await response.json();
            alert(datum.message);
        } else {
            updateContact();
        }

    }

    return ( 
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="firstName">First Name:</label>
                <input 
                    type="text" 
                    id="firstName" 
                    value={firstName} 
                    onChange={(evt) => setFirstName(evt.target.value)}
                />
            </div>
            <div>
                <label htmlFor="lastName">Last Name:</label>
                <input 
                    type="text" 
                    id="lastName" 
                    value={lastName} 
                    onChange={(evt) => setLastName(evt.target.value)}
                />
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input 
                    type="text" 
                    id="email" 
                    value={email} 
                    onChange={(evt) => setEmail(evt.target.value)}
                />
            </div>
            <div>
                <label htmlFor="phoneNum">Phone Number:</label>
                <input 
                    type="text" 
                    id="phoneNum" 
                    value={phoneNum} 
                    onChange={(evt) => setPhoneNum(evt.target.value)}
                />
            </div>
            <button type="submit">{updating ? "Update" : "Create"}</button>
        </form>
    );
};

export default ContactForm