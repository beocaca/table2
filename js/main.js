import 'regenerator-runtime/runtime'

import axios from "axios";

var baseUrl = 'https://satlegal.ebitc.com/api'

var list = []

var avtDefault = 'https://ehoadonvnpt.vn/public/uploads/system/noavatar.gif'

var countedItem = 0

var arrName = []

var callBackFocus = null

window.getGroup = async function getGroup(page = 1) {
  var endPoint = `${baseUrl}/dummies/groups/?page=${page}`
  var response = null
  try {
    response = await axios.get(endPoint)
  } catch (e) {
    console.log(e.response)
  }
  if (response) {
    reset()
    renderWrapGroup()
    countedItem = (response.data.count)
    renderCountItem(countedItem)
    renderCountPageGroup(Math.ceil(countedItem / 20), page)
    addTitleGroup()
    addFieldGroup()
    list = [...response.data.results]
    list.forEach(elm => {
      renderGroup(elm)
    })
    focusNext(addGroup)
    addBtn()
    console.log(response.data)
  }
}

function addFieldGroup() {
  var a = document.querySelector('#table')
  var html = `
    <div class="user-item last-user-item user-item-group">
        <div class="user-line ">
          <div class="control-delete addField">
            <div onclick="addGroup()" class="count-number">
            Add
            </div>
          </div>
        </div>
        <div class="user-line ">
          <input data-0="name" class="input-user" type="text">
          <div loading-0="name" class="user-load hidden--visually">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif" alt="">
          </div>
          <div valid-0="name" class="valid hidden--visually">
            <img src="https://image.flaticon.com/icons/png/512/2831/2831577.png" alt="">
            <div class="valid-tip">
             <div class="err-mess">
              <span err-0="name"> Lorem ipsum dolor sit amet.</span>
             </div>
            </div>
          </div>
        </div>
      </div>
  `
  a.insertAdjacentHTML('beforeend', html)
}

window.showAdd = function showAdd() {
  var a = document.querySelector('#table')
  a.classList.toggle('show-add-user')
  var all = document.querySelectorAll('[data-0]:not([type="file"])')
  all[0].focus()
  event.target.classList.toggle('add-item-show')
}

function addBtn() {
  var a = document.querySelector('#table')
  var html = `
        <div onclick="showAdd()" class="user-item add-item">
            Add Field
        </div>
          `
  a.insertAdjacentHTML('beforeend', html)
}

function addTitleGroup() {
  var a = document.querySelector('#table')
  var html = `
        <div class="user-item user-item-group">

        <div class="user-line user-tittle">
          Id
        </div>
        <div class="user-line user-tittle">
          Group
        </div>
      </div>
  `
  a.insertAdjacentHTML('afterbegin', html)
}

//href="http://localhost:1234/user.html?group=${elm.id}"

function renderGroup(elm) {
  var a = document.querySelector('.last-user-item')
  var html = `
      <div class="user-item user-item-group">
        <div class="user-line">
          <div class="control-delete">
            <div class="count-number">
              ${elm.id}
            </div>
            <div class="link-pop">
              <a onclick="pushStateUser(${elm.id},event)" href="http://localhost:1234/?group=${elm.id}"><i class="fas fa-external-link-alt"></i></a>
            </div>
            <div onclick="showDelete(event)" class="menu-delete">
              <i class="fas fa-ellipsis-v"></i>
              <div class="menu-delete-detail">
                <div onclick="delGroup(${elm.id},event)" class="delete-click">DELETE Group</div>
              </div>
              <div class="bg-cover"></div>
            </div>
          </div>
        </div>
        <div class="user-line">
          <input class="input-user" type="text" value="${elm.name}" data-${elm.id}="name"  onchange="editGroup(${elm.id},event)">
          <div loading-${elm.id}="name" class="hidden--visually user-load">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif" alt="">
          </div>
          <div valid-${elm.id}="name" class="valid hidden--visually">
            <img src="https://image.flaticon.com/icons/png/512/2831/2831577.png" alt="">
            <div class="valid-tip">
             <div class="err-mess">
              <span err-${elm.id}="name"> Lorem ipsum dolor sit amet.</span>
             </div>
            </div>
          </div>
        </div>
      </div>
    `
  a.insertAdjacentHTML("beforebegin", html)
}

function clearField() {

  var all = document.querySelectorAll('[data-0]')
  all.forEach(elm => {
    if (elm.files) {
      document.querySelector('[last-img-add]').src = avtDefault
    }
    elm.value = ''
  })
}

window.changeFileUpload = function changeFileUpload(evt) {
  var elmInput = evt.target
  var files = elmInput.files
  var imgHolder = elmInput.nextElementSibling
  if (files && files[0]) {
    var FR = new FileReader()
    FR.onload = function (e) {
      imgHolder.src = e.target.result
    }
    FR.readAsDataURL(files[0])
  }
}

function getDataField(id = 0) {
  var allFieldElm = document.querySelectorAll(`[data-${id}]`)
  var jsonData = {}
  var formData = new FormData()
  allFieldElm.forEach(elm => {
    var fieldName = elm.getAttribute(`data-${id}`)
    var isFieldUpload = elm.files
    if (isFieldUpload) {
      var arrFiles = Object.values(elm.files)
      for (var i = 0; i < arrFiles.length; i++) {
        jsonData[fieldName] = arrFiles[i]
        formData.append([fieldName], arrFiles[i])
      }
    } else {
      var fieldValue = elm.value
      jsonData[fieldName] = fieldValue
      formData.append(fieldName, fieldValue)
    }
  })
  return {
    jsonData,
    formData
  }
}

function validateName(name) {
  if (!name || !name.trim() || name.trim().length < 3 || name.trim().length > 15) {
    return false
  }
  return true
}

function validateEmail(email) {
  var re = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
  return re.test(String(email).toLowerCase());
}

function showValid(id) {
  document.querySelectorAll(`[valid-${id}]`)
    .forEach(elm => {
      elm.classList.remove('hidden-visually')
    })
}

function checkValue(id = 0) {
  var checkArr = []
  var all = document.querySelectorAll(`[data-${id}]:not([type="file"])`)
  var allArr = Array.from(all)
  var allErr = document.querySelectorAll(`[err-${id}]`)
  allErr.forEach(e => e.textContent = '')
  allArr.forEach(elm => {
    var x = elm.getAttribute(`data-${id}`)
    elm.classList.remove('validate-box')
    if (x === 'email') {
      if (validateEmail(elm.value) === false) {
        elm.classList.toggle('validate-box')
        document.querySelector(`[err-${id}=${x}]`)
          .textContent = 'Invalid email address'
        document.querySelector(`[valid-${id}=${x}]`)
          .classList.remove('hidden--visually')
        checkArr.push(false)
      } else {
        document.querySelector(`[valid-${id}=${x}]`)
          .classList.add('hidden--visually')
        checkArr.push(true)
      }
    } else {
      if (validateName(elm.value) === false) {
        elm.classList.toggle('validate-box')
        document.querySelector(`[err-${id}=${x}]`)
          .textContent = 'Must be between 3 and 15 characters'
        document.querySelector(`[valid-${id}=${x}]`)
          .classList.remove('hidden--visually')
        checkArr.push(false)
      } else {
        document.querySelector(`[valid-${id}=${x}]`)
          .classList.add('hidden--visually')
        checkArr.push(true)
      }
    }
  })
  return checkArr
}

function renderCountItem(number) {
  var a = document.querySelector('#count-item')
  var html = `
  <div class="">${number}</div>
      `
  a.innerHTML = html
}


function renderCountPageGroup(length, page) {
  var html = ''
  for (var i = 1; i <= length; i++) {
    var btnDiss = ''

    if (i === page) {
      btnDiss = 'disabled'
    }
    html += `
        <button ${btnDiss} onclick="getGroup(${i})"> Page ${i}</button>
            `
  }
  document.querySelector('#count-page').innerHTML = html
}

function renderCountPageUser(length, page) {
  var html = ''
  for (var i = 1; i <= length; i++) {
    var btnDiss = ''

    if (i === page) {
      btnDiss = 'disabled'
    }
    html += `
        <button ${btnDiss} onclick="getUsers(getIdGroup(),${i})"> Page ${i}</button>
            `
  }
  document.querySelector('#count-page').innerHTML = html
}


function renderCount(length) {
  var all = document.querySelectorAll('.count-number')
  for (var i = 0; i < length; i++) {
    all[i].innerHTML = i + 1
  }
}

function renderError(id = 0, errors) {
  var errKeys = Object.keys(errors)
  errKeys.forEach(k => {
    var arrMess = errors[k]
    var mess = arrMess.join()
    document.querySelector(`[err-${id} = "${k}"]`)
      .textContent = mess
    document.querySelector(`[valid-${id} = "${k}"]`)
      .classList.remove('hidden--visually')
    document.querySelector(`[data-${id} = "${k}"]`)
      .classList.add('validate-box')
  })
}

function removeErr(id = 0) {
  var all = document.querySelectorAll(`[err-${id}]`)
  all.forEach(elm => {
    elm.textContent = ''
  })
}

function scrollToView() {
  var all = document.querySelectorAll('.user-item')
  var a = all[all.length - 2]
  a.scrollIntoView(true)
}

window.addGroup = async function addGroup() {
  if (checkValue(0).every(x => x)) {
    var response = null
    var endPoint = `${baseUrl}/dummies/groups/`
    var dataPost = getDataField()
    var dataPostFormData = dataPost.formData
    apiRun(0, true)
    try {
      response = await axios.post(endPoint, dataPostFormData)
    } catch (e) {
      if (e.response) {
        removeErr()
        var errors = e.response.data
        renderError(0, errors)
      }
    } finally {
      apiRun(0, false)
    }
    if (response) {
      var newGroup = response.data
      list.push(newGroup)
      renderGroup(newGroup)
      clearField(0)
      scrollToView(0)
      removeErr()
      countedItem += 1
      renderCountItem(countedItem)
      console.log(list)
    }
  } else {
    return 0
  }
}
/*

var selector = "asdf"
var el;

selector = "";

// cach 1
try {
  var el = document.querySelector(selector);
} catch (e) {
  alert("Invalid element")
}

if (el) {
  //
}


// cach 2
if (typeof selector != "string" || !selector.trim().length) {
  alert("Invalid element")
} else {
  var el = document.querySelector(selector);


*/

window.delGroup = async function delGroup(id, e) {
  var endPoint = `${baseUrl}/dummies/groups/${id}/`
  var response = null
  try {
    response = axios.delete(endPoint)
  } catch (e) {
    console.log(e)
  }
  if (response) {
    e.target.parentNode.parentNode.parentNode.parentNode.parentNode.remove()
    var index = list.findIndex(e => {
      return e.id == `${id}`
    })
    list.splice(index, 1)
    countedItem -= 1
    renderCountItem(countedItem)
    renderCountPageGroup(Math.ceil(countedItem / 20), 1)
    console.log(list)
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

window.editGroup = async function editGroup(id, e) {
  if (checkValue(id).every(x => x)) {
    var endPoint = `${baseUrl}/dummies/groups/${id}/`
    var dataPost = getDataField(id)
    var dataPostFormData = dataPost.formData
    var response = null
    apiRun(id, true)
    try {
      response = await axios.put(endPoint, dataPostFormData)
    } catch (e) {
      if (e.response) {
        var errors = e.response.data
        renderError(id, errors)
      }
    } finally {
      apiRun(id, false)
    }
    if (response) {
      removeErr(id)
      console.log(response.data)
    }
  } else {
    return 0
  }
}

window.editUser = async function editUser(id) {
  if (checkValue(id).every(x => x)) {
    var endPoint = `${baseUrl}/dummies/groups/${getIdGroup()}/users/${id}/`
    var dataPost = getDataField(id)
    var dataPostFormData = dataPost.formData
    var response = null
    apiRun(id, true)
    removeErr(id)
    try {
      response = await axios.put(endPoint, dataPostFormData)
    } catch (e) {
      var a = (e.response.data)
      renderError(id, a)
    } finally {
      apiRun(id, false)
    }
    if (response) {
      console.log(response.data)
    }
  } else {
    return 0
  }

}


window.showDelete = function showDelete(event) {
  event.target.parentElement.classList.toggle('show')
}

function enterToAdd(callback) {
  var all = document.querySelectorAll('[data-0]')
  all.forEach(a => {
    a.addEventListener("keyup", e => {
      if (e.isComposing || e.keyCode === 13) {
        callback()
        console.log('Nam Enter')
      }
    });
  })

}

var listUser = []

window.getUsers = async function getUsers(groupID, page = 1) {
  var endPoint = `${baseUrl}/dummies/groups/${groupID}/users/?page=${page}`
  var response = null
  reset()
  try {
    response = await axios.get(endPoint)
  } catch (e) {

  }
  if (response) {
    renderWrapGroup()
    console.log(response.data.count)
    countedItem = response.data.count
    renderCountItem(countedItem)
    renderCountPageUser(Math.ceil(countedItem / 20), page)
    listUser = [...response.data.results]
    addTitleUser()
    addFieldUser()
    listUser.forEach(elm => {
      renderUsers(elm)
    })
    focusNext(addUser)
    console.log(listUser)
    addBtn()
  }
}

// href="http://localhost:1234/user.html/namlala=${user.id}"


function renderUsers(user) {
  var a = document.querySelector('.last-user-item')
  if (user.avatar == null) {
    user.avatar = avtDefault
  }
  var html = `
      <div class="user-item">
        <div class="user-line ">
          <div class="control-delete">
            <div class="count-number">
              ${user.id}
            </div>
            <div class="link-pop">
              <a onclick="pushStateUserDetail(event)" href=""><i class="fas fa-external-link-alt"></i></a>
            </div>
            <div onclick="showDelete(event)" class="menu-delete ">
              <i class="fas fa-ellipsis-v"></i>
              <div class="menu-delete-detail">
                <div onclick="delUser(${user.id},event)" class="delete-click">DELETE</div>
              </div>
              <div class="bg-cover"></div>
            </div>
          </div>
        </div>

        <div class="user-line box-img">
          <input multiple accept="image/*" onchange="editUser(${user.id}),changeFileUpload(event)" data-${user.id}="avatar" class="input-user" type="file" value="${user.avatar}">
          <img src="${user.avatar}">
          <div class="err-mess">
              <span err-${user.id}="avatar"> </span>
          </div>
        </div>
        <div class="user-line ">
          <input onchange="editUser(${user.id})" data-${user.id}="first_name" class="input-user" type="text"  value="${user.first_name}">
          <div loading-${user.id}="first_name" class="hidden--visually user-load">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif" alt="">
          </div>
          <div valid-${user.id}="first_name" class="valid hidden--visually">
            <img src="https://image.flaticon.com/icons/png/512/2831/2831577.png" alt="">
            <div class="valid-tip">
             <div class="err-mess">
              <span err-${user.id}="first_name"> Lorem ipsum dolor sit amet.</span>
             </div>
            </div>
          </div>
        </div>
        <div class="user-line ">
          <input onchange="editUser(${user.id})" data-${user.id}="last_name" class="input-user" type="text"  value="${user.last_name}">
          <div loading-${user.id}="last_name" class="hidden--visually user-load">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif" alt="">
          </div>
          <div valid-${user.id}="last_name" class="valid hidden--visually">
            <img src="https://image.flaticon.com/icons/png/512/2831/2831577.png" alt="">
            <div class="valid-tip">
             <div class="err-mess">
              <span err-${user.id}="last_name"> Lorem ipsum dolor sit amet.</span>
             </div>
            </div>
          </div>
        </div>
        <div class="user-line ">
          <input onchange="editUser(${user.id})" data-${user.id}="email" class="input-user" type="text"  value="${user.email}">
          <div loading-${user.id}="email" class="hidden--visually user-load">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif" alt="">
          </div>
          <div valid-${user.id}="email" class="valid hidden--visually">
            <img src="https://image.flaticon.com/icons/png/512/2831/2831577.png" alt="">
            <div class="valid-tip">
             <div class="err-mess">
              <span err-${user.id}="email"> Lorem ipsum dolor sit amet.</span>
             </div>
            </div>
          </div>
        </div>
      </div>
  `
  a.insertAdjacentHTML('beforebegin', html)
}

function addTitleUser() {
  var a = document.querySelector('#table')
  var html = `
       <div class="user-item">
        <div class="user-line user-tittle">
        ID
        </div>
        <div class="user-line user-tittle">
        Avatar
        </div>
        <div class="user-line user-tittle">
        FirstName
        </div>
        <div class="user-line user-tittle">
        LastName
        </div>
        <div class="user-line user-tittle">
        Email
        </div>
      </div>
  `
  a.insertAdjacentHTML('afterbegin', html)
}

function addFieldUser() {
  var a = document.querySelector('#table')
  var html = `
    <div class="user-item last-user-item">
        <div class="user-line ">
          <div class="control-delete addField">
            <div  class="count-number" onclick="addUser(event)">
            Add
            </div>
          </div>
        </div>
        <div class="user-line box-img">
          <input class="input-user" type="file" data-0='avatar' onchange="changeFileUpload(event)">
          <img last-img-add src="${avtDefault}" alt="">
            <div class="err-mess">
                <span err-0 ="avatar"></span>
            </div>
        </div>
        <div class="user-line ">
          <input class="input-user" type="text" data-0='first_name' >
                    <div loading-0="first_name" class="hidden--visually user-load">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif" alt="">
          </div>
          <div valid-${0}="first_name" class="valid hidden--visually">
            <img src="https://image.flaticon.com/icons/png/512/2831/2831577.png" alt="">
            <div class="valid-tip">
             <div class="err-mess">
              <span err-${0}="first_name"> Lorem ipsum dolor sit amet.</span>
             </div>
            </div>
          </div>
        </div>
        <div class="user-line ">
          <input class="input-user" type="text" data-0='last_name' >
         <div loading-0="last_name" class="hidden--visually user-load">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif" alt="">
          </div>
          <div valid-${0}="last_name" class="valid hidden--visually">
            <img src="https://image.flaticon.com/icons/png/512/2831/2831577.png" alt="">
            <div class="valid-tip">
             <div class="err-mess">
              <span err-${0}="last_name"> Lorem ipsum dolor sit amet.</span>
             </div>
            </div>
          </div>
        </div>
        <div class="user-line ">
          <input class="input-user" type="text" data-0='email' >
          <div loading-0="email" class="hidden--visually user-load">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif" alt="">
          </div>
          <div valid-${0}="email" class="valid hidden--visually">
            <img src="https://image.flaticon.com/icons/png/512/2831/2831577.png" alt="">
            <div class="valid-tip">
             <div class="err-mess">
              <span err-${0}="email"> Lorem ipsum dolor sit amet.</span>
             </div>
            </div>
          </div>
        </div>
      </div>
  `
  a.insertAdjacentHTML('beforeend', html)
}

window.addUser = async function addUser() {
  if (checkValue(0).every(x => x)) {
    var endPoint = `${baseUrl}/dummies/groups/${getIdGroup()}/users/`
    var dataPost = getDataField()
    var dataPostFormData = dataPost.formData
    apiRun(0, true)
    var response = null
    removeErr(0)
    try {
      response = await axios.post(endPoint, dataPostFormData)
    } catch (e) {
      if (e.response) {
        var errors = e.response.data
        renderError(0, errors)
      }
    } finally {
      apiRun(0, false)
    }
    if (response) {
      var newUser = response.data
      countedItem += 1
      listUser.push(newUser)
      renderCountItem(countedItem)
      renderUsers(newUser)
      clearField()
      console.log(listUser)
    }
  } else {
    return 0
  }
}

window.initResponseEdit = function initResponseEdit(newItem, id) {
  var all = document.querySelectorAll(`[data-${id}]`)
  all.forEach(elm => {
    var nameKey = elm.getAttribute(`data-${id}`)
    elm.value = newItem[nameKey]
  })
}

function apiRun(id = 0, trueFasle) {
  var a = 'setAttribute'
  if (!trueFasle) {
    a = 'removeAttribute'
  }
  var allInput = document.querySelectorAll(`[data-${id}]:not([type="file"])`)
  allInput.forEach(elm => {
    elm[`${a}`]('disabled', '')
    allInput[0].focus()
  })
  var allLoadImg = document.querySelectorAll(`[loading-${id}]`)
  allLoadImg.forEach(elm => {
    elm.classList.toggle('hidden--visually')
  })
}


window.delUser = async function delUser(id, e) {
  var endPoint = `${baseUrl}/dummies/groups/${getIdGroup()}/users/${id}/`
  var response = null
  try {
    response = await axios.delete(endPoint)
  } catch (e) {
    console.log(e)
  }
  if (response) {
    countedItem -= 1
    renderCountItem(countedItem)
    e.target.parentElement.parentNode.parentNode.parentNode.parentNode.remove()
    var a = listUser.findIndex(elm => elm.id == id)
    listUser.splice(a, 1)
    console.log(listUser)
  }
}

var kFocus = null

window.focusNext = function focusNext(callback) {
  var all = document.querySelectorAll('[data-0]:not([type="file"])')
  var allArr = Array.from(all)
  allArr.forEach(input => {
    var name = input.getAttribute('data-0')
    arrName.push(name)
  })
  callBackFocus = callback
}

document.addEventListener('keyup', e => {
    var all = document.querySelectorAll('[data-0]:not([type="file"])')
    var name = e.target.getAttribute('data-0')
    var isEnter = e.keyCode == 13
    for (var i = 0; i < arrName.length; i++) {
      if (isEnter && arrName[i] == name && arrName[arrName.length - 1] != name) {
        document.querySelector(`[data-0="${arrName[i + 1]}"]`).focus()
      }
    }
    if (isEnter && arrName[arrName.length - 1] == name) {
      all[0].focus()
      callBackFocus()
    }
  }
)

/*
for (var i = 0; i < arrName.length; i++) {
  if (isEnter && arrName[i] == name && arrName[arrName.length - 1] != name) {
    document.querySelector(`[data-0="${arrName[i + 1]}"]`).focus()
  }
}
if (isEnter && arrName[arrName.length - 1] == name) {
  callBackFocus()
}
*/

/*
for (var i = 0; i < arrName.length; i++) {
  if (isEnter && name === arrName[i] && name === arrName[arrName.length - 1]) {
    document.querySelector(`[data-0="${arrName[0]}"]`).focus()
    callBackFocus()
  } else if (isEnter && name === arrName[i]) {
    document.querySelector(`[data-0="${arrName[i + 1]}"]`).focus()
  } else {
  }
}
*/

function initFormValue(item) {
  var all = document.querySelectorAll(`[data-name]`)
  all.forEach(elm => {
    var fieldName = elm.getAttribute('data-name')
    elm.value = item[fieldName]
  })
}

function reset() {
  document.querySelector('#table').innerHTML = ''
}

function renderWrapGroup() {
  var a = document.querySelector('#status')
  var html = `
      <div class="status">
        <div class="status-left">
          <div onclick="showTable(event)" class="status-arrow">

          </div>
          <div class="status-text"> Status</div>
          <div class="status-method"> Doing</div>
        </div>
        <div class="status-right">
          <div class="count-item" id="count-item">
            3
          </div>
        </div>
      </div>
      `
  a.innerHTML = html
}

window.showTable = function showTable(e) {
  var a = document.querySelector('#table')
  a.classList.toggle('hidden--visually')
  e.target.classList.toggle('status-arrow-rotate')
  var x = document.querySelector('#status')
  x.classList.toggle('status-50')
}


window.getIdGroup = function getIdGroup() {
  var a = location.href
  var b = new URL(a)
  var c = b.searchParams.get('group')
  return c
}

window.pushStateUser = function pushStateUser(id, e) {
  e.preventDefault()
  history.pushState({id}, `Selected=${id}`, `./?group=${id}`)
  reset();
  getUsers(id, undefined);
  console.log(e)
}

window.pushStateUserDetail = function pushStateUserDetail(e) {
  e.preventDefault()
  history.pushState({id: null}, `Default`, `./`)
  reset();
  getGroup(1)
}


window.addEventListener('popstate', e => {
  reset()
  console.log(e);
  if (e.state && e.state.id !== null) {
    getUsers(e.state.id, undefined)
  } else {
    getGroup(1)
  }
})


// history.replaceState({id: null}, `Default`, `./`)
;
// need a ";" before
(() => {
  let groupID = getIdGroup();
  if (groupID) {
    getUsers(groupID, undefined)
  } else {
    getGroup(1)
  }
})();





