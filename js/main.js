import 'regenerator-runtime/runtime'

import axios from "axios";

var baseUrl = 'https://satlegal.ebitc.com/api'

var list = []

window.getGroup = async function getGroup() {
  //var endPoint = `${baseUrl}/dummies/groups/?page=${1}`
  var response = await axios.get(`${baseUrl}/dummies/groups/?page=${1}`)
  try {
    addTitleGroup()
    addFieldGroup()
    list = [...response.data.results]
    list.forEach(elm => {
      renderGroup(elm)
    })
    console.log(list)
  } catch (e) {

  } finally {

  }
}

function addFieldGroup() {
  var a = document.querySelector('#table')
  var html = `
    <div class="user-item">
        <div class="user-line ">
          <div class="control-delete">
            <div  class="count-number">
            Add
            </div>
            <div onclick="" class="link-pop">
              <i class="fas fa-external-link-alt"></i>
            </div>
            <div onclick="" class="menu-delete ">
              <i class="fas fa-ellipsis-v"></i>
              <div class="menu-delete-detail">
                <div class="delete-click">DELETE</div>
              </div>
              <div class="bg-cover"></div>
            </div>
          </div>
        </div>
        <div class="user-line ">
          <input data-field="name" class="input-user" type="text" data-field='name' onfocusout="addGroup()">
        </div>
      </div>
  `
  a.insertAdjacentHTML('beforeend', html)
}

function addTitleGroup() {
  var a = document.querySelector('#table')
  var html = `
        <div class="user-item">
        <div class="user-line">
          <span>Id</span>
        </div>
        <div class="user-line">
          <span>Group</span>
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
      <div class="user-item">
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
          <input class="input-user" type="text" value="${elm.name}" onfocusout="editGroup(${elm.id},event)">
        </div>
      </div>
    `
  a.insertAdjacentHTML("beforebegin", html)
}

function clearField() {
  var all = document.querySelectorAll('[data-field]')
  all.forEach(elm => {
    elm.value = ''
  })
}

function getField() {
  var allFieldElm = document.querySelectorAll('[data-field]')
  var jsonData = {}
  var formData = new FormData()
  allFieldElm.forEach(input => {
    var fieldName = input.getAttribute('data-field')
    var fieldValue = input.value
    jsonData[fieldName] = fieldValue
    formData.append([fieldName], fieldValue)
  })
  return {
    jsonData,
    formData
  }
}

function renderCount(length) {
  var all = document.querySelectorAll('.count-number')
  for (var i = 0; i < length; i++) {
    all[i].innerHTML = i + 1
  }
}

window.addGroup = async function addGroup() {
  if (document.querySelector('[data-field]').value === "") {
    return 0
  }
  var dataPost = getField()
  var dataPostFormData = dataPost.formData
  var endPoint = `${baseUrl}/dummies/groups/`
  try {
    var response = await axios.post(endPoint, dataPostFormData)
    var newGroup = response.data
    list.push(newGroup)
    renderGroup(newGroup)
    console.log(list)
  } catch (e) {
  }
}

window.delGroup = async function delGroup(id, e) {
  var endPoint = `${baseUrl}/dummies/groups/${id}`
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
  var endPoint = `${baseUrl}/dummies/groups/${id}`
  var value = e.target.value
  var formData = new FormData()
  formData.append('name', value)
  try {
    var response = await axios.put(endPoint, formData)
    console.log(response.data)
  } catch (e) {

  }
}

window.showDelete = function showDelete(event) {
  event.target.parentElement.classList.toggle('show')
}

function enterToAdd() {
  var a = document.querySelector('[data-field="name"]')
  a.addEventListener("keyup", e => {
    if (e.isComposing || e.keyCode === 13) {
      addGroup()
    }
  });

  /*
    var all = document.querySelectorAll('[group-id]')
    all.forEach(elm => {
      var id = elm.getAttribute('group-id')
      elm.addEventListener("keyup", e => {
        if (e.isComposing || e.keyCode === 13) {
          editGroup(`${id}`, event)
        }
        // do something
      });
    })
  */
}


var listUser = []

window.getUsers = async function getUsers(groupID) {
  var endPoint = `${baseUrl}/dummies/groups/${groupID}/users/`
  try {
    var respone = await axios.get(endPoint)
    listUser = [...respone.data.results]
    addTitleUser()
    addFieldUser()
    listUser.forEach(elm => {
      renderUsers(elm)
    })
    console.log(listUser)
  } catch (e) {

  } finally {

  }
}

// href="http://localhost:1234/user.html/namlala=${user.id}"

function renderUsers(user) {
  var all = document.querySelectorAll('.user-item')
  var a = all[all.length - 1]

  var html = `
      <div class="user-item">
        <div class="user-line ">
          <div class="control-delete">
            <div class="count-number">
              ${user.id}
            </div>
            <div class="link-pop">
              <a href="http://localhost:1234/user.html/namlala=${user.id}" ><i class="fas fa-external-link-alt"></i></a>
            </div>
            <div onclick="showDelete(event)" class="menu-delete ">
              <i class="fas fa-ellipsis-v"></i>
              <div class="menu-delete-detail">
                <div onclick="delUser(${user.id},getIdGroup,event)" class="delete-click">DELETE</div>
              </div>
              <div class="bg-cover"></div>
            </div>
          </div>
        </div>
        <div class="user-line ">
          <input class="input-user" type="text"  value="${user.first_name}">
        </div>
        <div class="user-line ">
          <input class="input-user" type="text"  value="${user.last_name}">
        </div>
        <div class="user-line ">
          <input class="input-user" type="text"  value="${user.email}">
        </div>
      </div>
  `
  a.insertAdjacentHTML('beforebegin', html)
}

function addTitleUser() {
  var a = document.querySelector('#table')
  var html = `
        <div class="user-item">
        <div class="user-line user-stt">
          <span>Id</span>
        </div>
        <div class="user-line user-first">
          <span>FirstName</span>
        </div>
        <div class="user-line user-last">
          <span>LastName</span>
        </div>
        <div class="user-line user-email">
          <span>Email</span>
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
          <div class="control-delete">
            <div  class="count-number">
            Add
            </div>
            <div onclick="addUser(event,getIdGroup)" class="link-pop">
              <i class="fas fa-external-link-alt"></i>
            </div>
            <div onclick="showDelete(event)" class="menu-delete ">
              <i class="fas fa-ellipsis-v"></i>
              <div class="menu-delete-detail">
                <div class="delete-click">DELETE</div>
              </div>
              <div class="bg-cover"></div>
            </div>
          </div>
        </div>
        <div class="user-line ">
          <input class="input-user" type="text" data-field='first_name' ">
        </div>
        <div class="user-line ">
          <input class="input-user" type="text" data-field='last_name' ">
        </div>
        <div class="user-line ">
          <input class="input-user" type="text" data-field='email' ">
        </div>
      </div>
  `
  a.insertAdjacentHTML('beforeend', html)
}

window.addUser = async function addUser(e, callback) {
  var endPoint = `${baseUrl}/dummies/groups/${callback()}/users/`
  var dataPost = getField()
  var dataPostFormData = dataPost.formData
  try {
    var response = await axios.post(endPoint, dataPostFormData)
    var newUser = response.data
    clearField()
    renderUsers(newUser)
    console.log(response.data)
  } catch (e) {

  } finally {
  }

}

window.delUser = async function delUser(id, callback, e) {
  var endPoint = `${baseUrl}/dummies/groups/${callback()}/users/${id}`
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

window.pushStateUser = function pushStateUser(id, e) {
  e.preventDefault()
  history.pushState({id}, `Selected=${id}`, `./?group=${id}`)
  reset();
  getUsers(id);
  console.log(e)
}

window.getIdGroup = function getIdGroup() {
  var a = location.href
  var b = new URL(a)
  var c = b.searchParams.get('group')
  return c
}

window.addEventListener('popstate', e => {
  reset()
  console.log(e);
  if (e.state.id !== null) {
    getUsers(e.state.id)
  } else {
    getGroup()
  }
})

history.replaceState({id: null}, `Default`, `./`)











