import 'regenerator-runtime/runtime'

import axios from "axios";

var baseUrl = 'https://satlegal.ebitc.com/api'

var list = []

var avtDefault = 'https://ehoadonvnpt.vn/public/uploads/system/noavatar.gif'

var countedItem = 0

window.getGroup = async function getGroup(page = 1) {
  // history.pushState({id: page}, `sad`, `.?page=${page}`)
  var endPoint = `${baseUrl}/dummies/groups/?page=${page}`
  try {
    reset()
    var response = await axios.get(endPoint)
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
  } catch (e) {

  } finally {

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
        <div class="err-mess">
            <span err-0 ="name"></span>
        </div>
        </div>
      </div>
  `
  a.insertAdjacentHTML('beforeend', html)
}

window.showAdd = function showAdd(e) {
  var a = document.querySelector('#table')
  a.classList.toggle('show-add-user')
  var all = document.querySelectorAll('[data-0]:not([type="file"])')
  all[0].focus()
}

function addBtn() {
  var a = document.querySelector('#table')
  var html = `
        <div onclick="showAdd(1)" class="user-item add-item">
            Add Nèw
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
          <div class="err-mess">
            <span err-${elm.id}="name"></span>
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

function addTextErr(id) {
  document.querySelector(`[err-${id}]`).textContent = 'sai Field'
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
        checkArr.push(false)
        document.querySelector(`[err-${id}='email']`).textContent = 'Type Email NOT Correct'
      } else {
        checkArr.push(true)
      }
    } else {
      if (validateName(elm.value) === false) {
        checkArr.push(false)
        elm.classList.toggle('validate-box')
        document.querySelector(`[err-${id}=${x}]`).textContent = '3 -> 15 Chars Please'
      } else {
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
    document.querySelector(`[err-${id} = "${k}"]`).textContent = mess
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
  try {
    if (checkValue(0).every(x => x)) {
      var endPoint = `${baseUrl}/dummies/groups/`
      var dataPost = getDataField()
      var dataPostFormData = dataPost.formData
      apiRun(0, true)
      var response = await axios.post(endPoint, dataPostFormData)
      var newGroup = response.data
      list.push(newGroup)
      renderGroup(newGroup)
      clearField(0)
      scrollToView(0)
      removeErr()
      countedItem += 1
      renderCountPageGroup(Math.ceil(countedItem / 20), 1)
      renderCountItem(countedItem)
      console.log(list)
    } else {
      return 0
    }
  } catch (e) {
    if (e.response) {
      removeErr()
      var errors = e.response.data
      renderError(0, errors)
    }
  } finally {
    apiRun(0, false)
  }
}


window.delGroup = async function delGroup(id, e) {
  var endPoint = `${baseUrl}/dummies/groups/${id}/`
  try {
    e.target.parentNode.parentNode.parentNode.parentNode.parentNode.remove()
    axios.delete(endPoint)
    var index = list.findIndex(e => {
      return e.id == `${id}`
    })
    list.splice(index, 1)
    countedItem -= 1
    renderCountItem(countedItem)
    renderCountPageGroup(Math.ceil(countedItem / 20), 1)
    console.log(list)
  } catch (e) {
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

window.editGroup = async function editGroup(id, e) {
  var endPoint = `${baseUrl}/dummies/groups/${id}/`
  // var value = e.target.value
  var dataPost = getDataField(id)
  var dataPostFormData = dataPost.formData
  try {
    if (checkValue(id).every(x => x)) {
      // show loading
      apiRun(id, true)
      var response = await axios.put(endPoint, dataPostFormData)
      // hide loading
      removeErr(id)
      /*  var newGroup = response.data
        initResponseEdit(newGroup, id)*/
      console.log(response.data)
    } else {
      return 0
    }
  } catch (e) {
    if (e.response) {
      var errors = e.response.data
      renderError(id, errors)
    }
  } finally {
    apiRun(id, false)

  }
}

window.editUser = async function editUser(id) {
  var endPoint = `${baseUrl}/dummies/groups/${getIdGroup()}/users/${id}/`
  var dataPost = getDataField(id)
  var dataPostFormData = dataPost.formData
  try {
    if (checkValue(id).every(x => x)) {
      apiRun(id, true)

      var response = await axios.put(endPoint, dataPostFormData)
      removeErr(id)
      console.log(response)
    } else {
      return 0
    }

  } catch (e) {
    var a = (e.response.data)
    removeErr(id)
    renderError(id, a)
  } finally {
    apiRun(id, false)
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
  try {
    reset()
    var response = await axios.get(endPoint)
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
  } catch (e) {

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
              <span err-${user.id}="first_name"> </span>
          </div>
        </div>
        <div class="user-line ">
          <input onchange="editUser(${user.id})" data-${user.id}="first_name" class="input-user" type="text"  value="${user.first_name}">
        <div class="err-mess">
        <span err-${user.id}="first_name"> </span>
        </div>
        </div>
        <div class="user-line ">
          <input onchange="editUser(${user.id})" data-${user.id}="last_name" class="input-user" type="text"  value="${user.last_name}">
          <div class="err-mess">
            <span err-${user.id}="last_name"></span>
          </div>
        </div>
        <div class="user-line ">
          <input onchange="editUser(${user.id})" data-${user.id}="email" class="input-user" type="text"  value="${user.email}">
          <div class="err-mess">
         <span err-${user.id}="email"></span>
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
            <div class="err-mess">
                <span err-0 ="first_name"></span>
             </div>
        </div>
        <div class="user-line ">
          <input class="input-user" type="text" data-0='last_name' >
            <div class="err-mess">
                <span err-0 ="last_name"></span>
             </div>
        </div>
        <div class="user-line ">
          <input class="input-user" type="text" data-0='email' >
            <div class="err-mess">
                 <span err-0 ="email"></span>
             </div>
        </div>
      </div>
  `
  a.insertAdjacentHTML('beforeend', html)
}

window.addUser = async function addUser() {
  var endPoint = `${baseUrl}/dummies/groups/${getIdGroup()}/users/`
  var dataPost = getDataField()
  var dataPostFormData = dataPost.formData
  try {
    if (checkValue(0).every(x => x)) {
      apiRun(0, true)
      var response = await axios.post(endPoint, dataPostFormData)
      var newUser = response.data
      countedItem+=1
      renderCountItem(countedItem)
      renderCountPageUser(Math.ceil(countedItem / 20), 1)
      renderUsers(newUser)
      removeErr(0)
      clearField()
    } else {
      return 0
    }
  } catch (e) {
    if (e.response) {
      removeErr(0)
      var errors = e.response.data
      renderError(0, errors)
    }
  } finally {
    apiRun(0, false)
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
  var all = document.querySelectorAll(`[data-${id}]:not([type="file"])`)
  all.forEach(elm => {
    elm[`${a}`]('disabled', '')
    all[0].focus()
  })
}


window.delUser = async function delUser(id, e) {
  var endPoint = `${baseUrl}/dummies/groups/${getIdGroup()}/users/${id}/`
  try {
    countedItem-=1
    renderCountItem(countedItem)
    renderCountPageUser(Math.ceil(countedItem / 20), 1)
    var index = listUser.findIndex(e => e.id == id)
    list.splice(index, 1)
    var response = await axios.delete(endPoint)
    e.target.parentElement.parentNode.parentNode.parentNode.parentNode.remove()
    console.log(e)
  } catch (e) {
  }
}

window.focusNext = function focusNext(callback) {
  var arrName = []
  var all = document.querySelectorAll('[data-0]:not([type="file"])')
  all.forEach(input => {
    var name = input.getAttribute('data-0')
    arrName.push(name)
  })

  document.addEventListener('keyup', e => {
    var name = e.target.getAttribute('data-0')
    var isEnter = e.keyCode == 13

    for (var i = 0; i < arrName.length; i++) {
      if (isEnter && arrName[i] == name && arrName[arrName.length - 1] != name) {
        document.querySelector(`[data-0="${arrName[i + 1]}"]`).focus()
        console.log('Namhuhu')
      }
    }
    if (isEnter && arrName[arrName.length - 1] == name) {
      callback()
    }
  })
}

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





