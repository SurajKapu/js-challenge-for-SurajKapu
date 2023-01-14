
let form = document.getElementById("form")
let table = document.getElementById("fetch_table")
let thead = document.getElementById("fetch_table_head")
let tbody = document.getElementById("fetch_table_body")

let success = document.getElementById("success")
let request_fail = document.getElementById("request_fail")
/******* INPUT FIELDS *******/
let firstname_input = document.getElementById("firstname_input")
let lastname_input = document.getElementById("lastname_input")
let username_input = document.getElementById("username_input")
let email_input = document.getElementById("email_input")
let address_input = document.getElementById("address_input")
let phone_input = document.getElementById("phone_input")
let website_input = document.getElementById("website_input")
let company_input = document.getElementById("company_input")

/******* ERROR VALIDITY *******/
let firstname_validity = document.getElementById("firstname_validity")
let lastname_validity = document.getElementById("lastname_validity")
let username_validity = document.getElementById("username_validity")
let email_validity = document.getElementById("email_validity")
let address_validity = document.getElementById("address_validity")
let phone_validity = document.getElementById("phone_validity")
let url_validity = document.getElementById("url_validity")

/******* ERROR MESSAGE *******/
let firstname_error_message = document.getElementById("firstname_error_message")
let lastname_error_message = document.getElementById("lastname_error_message")
let username_error_message = document.getElementById("username_error_message")
let email_error_message = document.getElementById("email_error_message")
let address_error_message = document.getElementById("address_error_message")
let phone_error_message = document.getElementById("phone_error_message")
let url_error_message = document.getElementById("url_error_message")

/******* REGEX *******/
let alphanumeric = /^[0-9a-zA-Z]+$/
let dot_alphanumeric = /^[a-zA-Z0-9\.]*$/
let email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
let phone_regex = /^(\d{3})(\d{3})(\d{4})$/
let url_regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/

let form_users = []
let table_body_data = ''

const url = "https://jsonplaceholder.typicode.com/users"
let fetched_data = []
let index = 1

form.addEventListener('submit', submit)

function submit(event) {
    event.preventDefault()
    let all_fields_are_valid = validate_details()
  
    if(all_fields_are_valid) {
        store_userdata()
        update_table()
        clear_fields()
        show_status()
    }
}

function validate_details() {
    let all_fields_are_valid = true
    all_fields_are_valid &= validate_firstname()
    all_fields_are_valid &= validate_lastname()
    all_fields_are_valid &= validate_username()
    all_fields_are_valid &= validate_email()
    all_fields_are_valid &= validate_address()
    all_fields_are_valid &= validate_phone()
    all_fields_are_valid &= validate_url() 
    return all_fields_are_valid
}

function show_data() {
    fetch_APIdata()
    fetch_localdata()
}

async function fetch_APIdata() {
    let response = await fetch(url)
    const request_success = (response.status == 200)
    if(!request_success) {
        request_fail.style.display = "block"
        setTimeout(() => {
            request_fail.style.display = "none"        
        }, 3000);
    }
    else {
        let data = await response.json()
        table_headers = Object.keys(data[0])
        data.forEach(user => {
            fetched_data.push(user)
        })
    }
    display_table()
}

function fetch_localdata() {
    let local_users = JSON.parse(window.localStorage.getItem("users")) 
    if(local_users != null) {
        local_users.forEach(local_user => {
            fetched_data.push(local_user)
            form_users.push(local_user)
        });
    }
}

function display_table() {
    display_head()
    display_body()
}

function display_head() {
    let head_data = '<tr>'
    table_headers.forEach(header => {
        head_data += `<th>${header.toUpperCase()}</th>`
    })
    head_data += '</tr>'
    fetch_table_head.innerHTML = head_data
}

function display_body() {
    fetched_data.forEach((user) => {
        let address = user.address
        let new_row = `<tr>
        <td>${index}</td>
        <td>${user.name} </td>
        <td>${user.username}</td>
        <td>${user.email}</td>`

        if(typeof(address) == "string") {
            new_row += `<td>${address}</td>`
        }
        else {
            new_row +=`<td>${address.street + ", " + address.suite + ", " + address.city + ", " + address.zipcode}</td>`
        }

        new_row +=`
            <td>${user.phone}</td>
            <td>${user.website}</td>`

        if(typeof(user.company) == "string") {
            new_row += `<td>${user.company}</td></tr>`
        }
        else {
            new_row += `<td>${user.company.name}</td></tr>`
        }

      table_body_data += new_row
      index++
    })
    fetch_table_body.innerHTML = table_body_data;
}

function store_userdata() {
    let firstname = firstname_input.value
    let lastname = lastname_input.value
    let username = username_input.value
    let email = email_input.value
    let address = address_input.value
    let phone = phone_input.value
    let website = website_input.value
    let company = company_input.value

    let new_user = {
        "name" : firstname +" "+ lastname,
        "username" : username,
        "email" : email,
        "address" : address,
        "phone" : phone,
        "website" : website,
        "company" : company
    }
    form_users.push(new_user)
    window.localStorage.setItem("users", JSON.stringify(form_users))
}

function clear_fields() {
    form.reset()
}

function show_status() {
    success.style.display = "block"
    setTimeout(() => {
        success.style.display = "none"        
    }, 1000);
}

function update_table() {
        let last_row = form_users.length-1
        let user = form_users[last_row]
        let new_row = `<tr>
            <td>${index}</td>
            <td>${user.name}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.address}</td>
            <td>${user.phone}</td>
            <td>${user.website}</td>
            <td>${user.company}</td>            
        </tr>`
        table_body_data += new_row
        tbody.innerHTML = table_body_data
}

function validate_firstname() {
	let firstname = firstname_input.value
    firstname_validity.innerHTML = ""
    firstname_error_message.innerHTML = ""
    
    if(firstname.length == 0) {
        firstname_validity.innerText = "Please enter first name"
    }
    else if(!firstname.match(alphanumeric)) {
        firstname_validity.innerText = "Invalid"
        firstname_error_message.innerText = "First name must contain alphabets or numbers."
    }
    else if(firstname.length < 3) {
        firstname_validity.innerText = "Invalid"
        firstname_error_message.innerText = "First name must be 3 characters or more."
    }
    else {
        return true
    }
    return false
}

function validate_lastname() {
	let lastname = lastname_input.value
    lastname_validity.innerHTML = ""
    lastname_error_message.innerHTML = ""
    if(lastname.length == 0) {
        lastname_validity.innerHTML = "Please enter last name"
    }
    else if(!lastname.match(alphanumeric)) {
        lastname_validity.innerHTML = "Invalid"
        lastname_error_message.innerHTML = "Last name must contain alphabets or numbers."
    }
    else if(lastname.length < 3) {
        lastname_validity.innerHTML = "Invalid"
        lastname_error_message.innerHTML = "Last name must be 3 characters or more."
    }
    else {
        return true
    }
    return false
}

function validate_username() {
	let username = username_input.value
    username_validity.innerHTML = ""
    username_error_message.innerHTML = ""
    if(username.length == 0) {
        username_validity.innerHTML = "Please enter username"
    }
    else if(!username.match(dot_alphanumeric)) {
        username_validity.innerHTML = "Invalid"
        username_error_message.innerHTML = "Username must contain alphabets or numbers."
    }
    else {
        return true
    }
    return false
}

function validate_email() {
	let email = email_input.value
    email_validity.innerHTML = ""
    email_error_message.innerHTML = ""
    if(email.length == 0) {
        email_validity.innerHTML = "Please enter Email"
    }
    else if(!email.match(email_regex)) {
        email_validity.innerHTML = "Invalid Email"
        email_error_message.innerHTML = "Please enter a valid Email."
    }
    else {
        return true
    }
    return false
}

function validate_phone() {
	let phone = phone_input.value
    phone_validity.innerHTML = ""
    phone_error_message.innerHTML = ""
    if(phone.length == 0) {
        phone_validity.innerHTML = "Please enter phone number."
    }
    else if(!phone.match(phone_regex)) {
        phone_validity.innerHTML = "Invalid phone"
        phone_error_message.innerHTML = "Please enter a valid phone. Format: 123-456-7890"
    }
    else {
        return true
    }
    return false
}

function validate_address() {
	let address = address_input.value
    address_validity.innerHTML = ""
    address_error_message.innerHTML = ""
    if(address.length == 0) {
        address_validity.innerHTML = "Please enter address."
        return false
    }
    return true
}

function validate_url() {
	let url = website_input.value
    url_validity.innerHTML = ""
    url_error_message.innerHTML = ""
    if(url.length > 0 && !url.match(url_regex)) {
        url_validity.innerHTML = "Invalid url"
        url_error_message.innerHTML = "Please enter a valid url."
        return false
    }
    return true
}

// window.localStorage.clear()
window.onload = show_data()