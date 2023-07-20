var siteNameBox = document.getElementById("siteNameBox");
var siteUrlBox = document.getElementById("siteUrlBox");

// two icons hidden in 1st box
var errorIcon1 = document.getElementById("error-icon-1");
var successIcon1 = document.getElementById("success-icon-1");

// two icons hidden in 2nd box
var errorIcon2 = document.getElementById("error-icon-2");
var successIcon2 = document.getElementById("success-icon-2");

// submit btn
var submitBtn = document.getElementById("submitBtn");

// input values
var siteName = document.getElementById("siteName");
var siteUrl = document.getElementById("siteUrl");

// validateBookMark
function validateBookfn(bookMark) {
  return bookMark.value.length > 2;
}

// validateUrl
function validateUrlfn(url) {
  return /^[a-zA-z0-9]+\.[a-zA-z0-9]{2,}$/.test(url.value);
}

// general function to add success box
function addSuccessBox(box) {
  if (box.classList.contains("box-error")) box.classList.remove("box-error");
  if (!box.classList.contains("box-success")) box.classList.add("box-success");
}

// general function to add error box
function addErrorBox(box) {
  if (box.classList.contains("box-success")) box.classList.remove("box-success");
  if (!box.classList.contains("box-error")) box.classList.add("box-error");
}

function defaultBox(box, successIcon) {
  if (box.classList.contains("box-success"))
    box.classList.remove("box-success");
  if (!successIcon.classList.contains("d-none"))
    successIcon.classList.add("d-none");
}

// general function to replace the second icon with the first icon
function changeTwoIcon(one, two) {
  if (!one.classList.contains("d-none")) one.classList.add("d-none");

  if (two.classList.contains("d-none")) two.classList.remove("d-none");
}

// function related with bookMark input; called onInput event
function validateBookMark(inputBox) {
  if (!validateBookfn(inputBox)) {
    addErrorBox(siteNameBox);
    changeTwoIcon(successIcon1, errorIcon1);
    submitBtn.setAttribute("data-bs-toggle", "modal");
  } else {
    addSuccessBox(siteNameBox);
    changeTwoIcon(errorIcon1, successIcon1);
    siteUrl = document.getElementById("siteUrl");
    if (validateUrlfn(siteUrl)) {
      submitBtn.removeAttribute("data-bs-toggle");
    }
  }
}

// function related with urlSite input; called onInput event
function validateUrl(inputBox) {
  if (validateUrlfn(inputBox)) {
    addSuccessBox(siteUrlBox);
    changeTwoIcon(errorIcon2, successIcon2);
    siteName = document.getElementById("siteName");
    if (validateBookfn(siteName)) {
      submitBtn.removeAttribute("data-bs-toggle");
    }
  } else {
    addErrorBox(siteUrlBox);
    changeTwoIcon(successIcon2, errorIcon2);
    submitBtn.setAttribute("data-bs-toggle", "modal");
  }
}

//--------------------------------------------------------------------------------------
// Save & represent data
//----------------
function clearInputs() {
  siteName.value = null;
  siteUrl.value = null;
}

// first check that local storege is empty or not
var allUrls;
if (localStorage.getItem("localUrls") == null) {
  allUrls = [];
} else {
  allUrls = JSON.parse(localStorage.getItem("localUrls"));

  // console.log(allUrls);
  displayUrls();
}

// add url
function addUrl() {
  if (validateBookfn(siteName) && validateUrlfn(siteUrl)) {
    var url = {
      siteName: siteName.value,
      siteUrl: siteUrl.value,
    };
    if (!existUrl(url.siteName)) {
      // push url to array
      allUrls.push(url);

      // update urls in localStorege
      localStorage.setItem("localUrls", JSON.stringify(allUrls));

      // show all urls after adding new
      displayUrls();

      clearInputs();

      defaultBox(siteNameBox, successIcon1);
      defaultBox(siteUrlBox, successIcon2);
    } else {
      document.getElementById("error-repeat").classList.remove("d-none");
      setTimeout(() => {
        document.getElementById("error-repeat").classList.add("d-none");
      }, 5000);
    }
  } 
}

// check that url exist
function existUrl(nameVal) {
  for (let i = 0; i < allUrls.length; i++) {
    if(nameVal == allUrls[i].siteName) {
      return true;
    }
  }
  return false;
}

// display urls
function displayUrls() {
  var allRows = ``;
  for (let i = 0; i < allUrls.length; i++) {
    allRows += `
            <tr>
              <td>${i+1}</td>
              <td>${allUrls[i].siteName}</td>
              <td><a href="https://${allUrls[i].siteUrl}" class="visit-link"><i class="fa-solid fa-eye pe-2"></i>visit</a></td>
              <td><button onclick="deleteUrl(${i})" class="delete-btn btn btn-danger text-capitalize"><i class="fa-solid fa-trash-can"></i>
                  delete</button></td>
            </tr>`;
  }
  document.getElementById("urlView").innerHTML=allRows;
}

// delete url
function deleteUrl(pIndex) {
  allUrls.splice(pIndex, 1); 

  localStorage.setItem("localUrls", JSON.stringify(allUrls));
  displayUrls(); 
}