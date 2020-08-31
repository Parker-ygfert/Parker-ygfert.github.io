window.addEventListener("DOMContentLoaded", function() {
  const search = document.forms[0];
  const inputForm = document.forms[1];
  const records = document.querySelector("#records-panel");
  const template = document.querySelector("#temp");
  let local = JSON.parse(localStorage.getItem("records")) || [];

  // inputForm.querySelectorAll("div").forEach(function(input) {
    // let pop = document.createElement("div")
    // let popup = document.createElement("span");
    // pop.classList.add("popup");
    // popup.classList.add("popuptext");
    // pop.appendChild(popup);
    // input.appendChild(pop);
  // })

  renderItems(local.sort((a, b) => a.date > b.date ? 1 : -1));

  inputForm.date.setAttribute("required", "required");
  inputForm.amount.setAttribute("required", "required");
  inputForm.description.setAttribute("required", "required");

  inputForm.addEventListener("submit", function(e) {
    e.preventDefault();

    // if (!inputForm.date.value) {
    //   inputForm.date.style.borderColor = "red";
    //   popup = inputForm[1].nextElementSibling.firstChild;
    //   popup.classList.add("show");
    //   popup.textContent = "請選擇日期";
    //   return;
    // } else {
    //   inputForm.date.style.borderColor = "#495057";
    //   popup.classList.remove("show");
    // }
    // if (!inputForm.amount.value) {
    //   inputForm.amount.style.borderColor = "red";
    //   popup = inputForm[2].nextElementSibling.firstChild;
    //   popup.classList.add("show");
    //   popup.textContent = "請填入金額";
    //   return;
    // } else {
    //   inputForm.amount.style.borderColor = "#495057";
    //   popup.classList.remove("show");
    // }
    // if (!inputForm.description.value) {
    //   inputForm.description.style.borderColor = "red";
    //   popup = inputForm[3].nextElementSibling.firstChild;
    //   popup.classList.add("show");
    //   popup.textContent = "請填寫記帳描述";
    //   return;
    // } else {
    //   inputForm.description.style.borderColor = "#495057";
    //   popup.classList.remove("show");
    // }
    
    let revenue = {
      uuid: generateUUID(),
      date: inputForm.date.value,
      category: inputForm.category.value,
      amount: inputForm.amount.value,
      description: inputForm.description.value
    }
    local.push(revenue);
    local.sort((a, b) => a.date > b.date ? 1 : -1);
    localStorage.setItem("records", JSON.stringify(local));
    console.log(JSON.parse(localStorage.getItem("records")));

    inputForm.reset();

    generateRecord(revenue);
    records.innerHTML = "";
    renderItems(local);
    // console.log(generateRecord(revenue));
  });



  //* 移除記帳資料
  records.addEventListener("click", function(e) {
    // console.log(e.target.dataset["uuid"]);
    if (!e.target.classList.contains("remove")) {
      return;
    }

    localStorage.setItem("records", JSON.stringify(local.filter(function(item) {
        return item.uuid !== e.target.dataset.uuid;
      })
    ));

    local = JSON.parse(localStorage.getItem("records")) || [];

    e.target.parentNode.parentNode.remove();
  });



  search.addEventListener("submit", function(e) {
    e.preventDefault();

    if ((search.category.value) && (search.month.value)) {
      records.innerHTML = "";
      renderItems(local.filter(function(item) {
        return (item.category === search.category.value && item.date.match(new RegExp(`^${search.month.value}`)));
      }));
    } else if (search.category.value) {
      records.innerHTML = "";
      renderItems(local.filter(function(item) {
        return item.category === search.category.value;
      }));
    } else if (search.month.value) {
      // console.log(`${search.month.value}`);
      records.innerHTML = "";
      renderItems(local.filter(function(item) {
        return item.date.match(new RegExp(`^${search.month.value}`));
      }));
    }

    search.reset();
  });



  function generateRecord({uuid, date, category, amount, description}) {
    let th = template.content.querySelector("th");
    let td = template.content.querySelectorAll("td");
    let remove = template.content.querySelector("span.remove");

    th.textContent = date;
    td[0].textContent = category;
    td[1].textContent = description;
    td[2].textContent = amount;

    remove.setAttribute("data-uuid", uuid);

    let clone = document.importNode(template.content, true);
    records.prepend(clone);
  };



  function renderItems(local) {
    local.forEach(function(item) {
      generateRecord(item);
      // console.log(item.uuid);
    });
  };
});

function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d+ Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
};
