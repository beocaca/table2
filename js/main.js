import 'regenerator-runtime/runtime'

import axios from "axios";

var baseUrl = 'https://satlegal.ebitc.com/api'

var list = []
var avtDefault = 'https://ehoadonvnpt.vn/public/uploads/system/noavatar.gif'

window.getGroup = async function getGroup(page = 1) {
  // history.pushState({id: page}, `sad`, `.?page=${page}`)
  var endPoint = `${baseUrl}/dummies/groups/?page=${page}`
  try {
    reset()
    var response = await axios.get(endPoint)
    var countPages = Math.ceil(response.data.count / 20)
    renderCountPage(countPages, page)
    addTitleGroup()
    addFieldGroup()
    list = [...response.data.results]
    list.forEach(elm => {
      renderGroup(elm)
    })
    enterToAdd(addGroup)
    console.log(list)
  } catch (e) {

  } finally {

  }
}

function addFieldGroup() {
  var a = document.querySelector('#table')
  var html = `
    <div class="user-item user-item-group">
        <div class="user-line ">
          <div class="control-delete addField">
            <div onclick="" class="count-number">
            Add
            </div>
          </div>
        </div>
        <div class="user-line ">
          <input data-0="name" class="input-user" type="text" onchange="addGroup()">
        <div class="err-mess">
            <span err-0 ="name"></span>
        </div>
        </div>
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
  var all = document.querySelectorAll('.user-item')
  var a = all[all.length - 1]
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

function renderCountPage(length, page) {
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
    var strMess = arrMess.join()
    document.querySelector(`[err-${id} = "${k}"]`).textContent = strMess
  })
}

function removeErr(id = 0) {
  var all = document.querySelectorAll(`[err-${id}]`)
  all.forEach(elm => {
    elm.textContent = ''
  })
}

function scrollTop() {
  var a = document.querySelector('#table')
  a.scrollTop = a.scrollHeight
}

window.addGroup = async function addGroup() {
  if (document.querySelector('[data-0]').value === "") {
    return 0
  }
  var dataPost = getDataField()
  var dataPostFormData = dataPost.formData
  var endPoint = `${baseUrl}/dummies/groups/`
  var newId = null
  try {
    var response = await axios.post(endPoint, dataPostFormData)
    var newGroup = response.data
    list.push(newGroup)
    renderGroup(newGroup)
    newId = newGroup.id
    clearField(0)
    scrollTop()
    console.log(list)
    removeErr()
  } catch (e) {
    if (e.response) {
      removeErr()
      var errors = e.response.data
      renderError(0, errors)
    }
  }
}

window.delGroup = async function delGroup(id, e) {
  var endPoint = `${baseUrl}/dummies/groups/${id}/`
  try {
    e.target.parentNode.parentNode.parentNode.parentNode.parentNode.remove()
    var response = await axios.delete(endPoint)
    var index = list.findIndex(e => {
      return e.id == `${id}`
    })
    list.splice(index, 1)
    console.log(list)
  } catch (e) {
  }
}

window.editGroup = async function editGroup(id, e) {
  var endPoint = `${baseUrl}/dummies/groups/${id}/`
  // var value = e.target.value
  var dataPost = getDataField(id)
  var dataPostFormData = dataPost.formData
  try {
    var response = await axios.put(endPoint, dataPostFormData)
    removeErr(id)
    /*  var newGroup = response.data
      initResponseEdit(newGroup, id)*/
    console.log(response.data)
  } catch (e) {
    if (e.response) {
      var errors = e.response.data
      renderError(id, errors)
    }
  }
}

window.editUser = async function editUser(id) {
  var endPoint = `${baseUrl}/dummies/groups/${getIdGroup()}/users/${id}/`
  var dataPost = getDataField(id)
  var dataPostFormData = dataPost.formData
  try {
    var response = await axios.put(endPoint, dataPostFormData)
    removeErr(id)
    console.log(response)
  } catch (e) {
    var a = (e.response.data)
    removeErr(id)
    renderError(id, a)
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
    var countPages = Math.ceil(response.data.count / 20)
    renderCountPageUser(countPages, page)
    listUser = [...response.data.results]
    addTitleUser()
    addFieldUser()
    listUser.forEach(elm => {
      renderUsers(elm)
    })
    enterToAdd(addUser)
    console.log(listUser)
  } catch (e) {

  } finally {

  }
}

// href="http://localhost:1234/user.html/namlala=${user.id}"


function renderUsers(user) {
  var all = document.querySelectorAll('.user-item')
  var a = all[all.length - 1]
  if (user.avatar == null) {
    user.avatar = avtDefault
  }
//http://localhost:1234/index.html
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
    <div class="user-item">
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
          <input class="input-user" type="text" data-0='first_name' ">
            <div class="err-mess">
                <span err-0 ="first_name"></span>
             </div>
        </div>
        <div class="user-line ">
          <input class="input-user" type="text" data-0='last_name' ">
            <div class="err-mess">
                <span err-0 ="last_name"></span>
             </div>
        </div>
        <div class="user-line ">
          <input class="input-user" type="text" data-0='email' ">
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
    var response = await axios.post(endPoint, dataPostFormData)
    var newUser = response.data
    renderUsers(newUser)
    removeErr(0)
    clearField()
    console.log(response.data)
  } catch (e) {
    if (e.response) {
      removeErr(0)
      var errors = e.response.data
      renderError(0, errors)
    }
  }
}

window.initResponseEdit = function initResponseEdit(newItem, id) {
  var all = document.querySelectorAll(`[data-${id}]`)
  all.forEach(elm => {
    var nameKey = elm.getAttribute(`data-${id}`)
    elm.value = newItem[nameKey]
  })
}

window.delUser = async function delUser(id, e) {
  var endPoint = `${baseUrl}/dummies/groups/${getIdGroup()}/users/${id}/`
  try {
    var index = listUser.findIndex(e => e.id == id)
    list.splice(index, 1)
    var response = await axios.delete(endPoint)
    e.target.parentElement.parentNode.parentNode.parentNode.parentNode.remove()
    console.log(e)
  } catch (e) {
  }
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
(_ => {
  let groupID = getIdGroup();
  if (groupID) {
    getUsers(groupID, undefined)
  } else {
    getGroup(undefined)
  }
})();





