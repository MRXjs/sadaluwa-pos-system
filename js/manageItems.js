const apiUrl = "https://sadaluwa.ytdonline.com";

window.onload = async (e) => {
  const itemsData = await apiReq("get", `${apiUrl}/item/get`);

  itemsDataDisplay(itemsData);
  console.log(itemsData);
};

function itemsDataDisplay(itemsData) {
  const itemTableBody = document.getElementById("itemTableBody");
  itemsData.reverse();
  itemsData.map((value) => {
    const trElement = document.createElement("tr");
    trElement.id = `tr${value.id}`;

    const nameElement = document.createElement("td");
    nameElement.classList.add("item-table-data");
    nameElement.innerText = value.name;

    const casePriceElement = document.createElement("td");
    casePriceElement.classList.add("item-table-data");
    casePriceElement.innerText = value.case_price;

    const wholesalePriceElement = document.createElement("td");
    wholesalePriceElement.classList.add("item-table-data");
    wholesalePriceElement.innerText = value.wholesale_price;

    const retailPriceElement = document.createElement("td");
    retailPriceElement.classList.add("item-table-data");
    retailPriceElement.innerText = value.retail_price;

    const deletebtnTdElement = document.createElement("td");
    deletebtnTdElement.classList.add("item-table-data");

    const deleteBtnElement = document.createElement("button");
    deleteBtnElement.classList.add("delete-btn");
    deleteBtnElement.innerText = "Delete";
    deleteBtnElement.onclick = (e) => {
      itemDelete(value);
    };

    const editBtnTdElement = document.createElement("td");
    editBtnTdElement.classList.add("item-table-data");

    const editBtnElement = document.createElement("button");
    editBtnElement.innerText = "Edit";
    editBtnElement.classList.add("edit-btn");
    editBtnElement.value = JSON.stringify(value);
    editBtnElement.onclick = (e) => {
      itemFormClear();
      itemEdit(value);
      // disableEditBtns();
    };

    deletebtnTdElement.appendChild(deleteBtnElement);

    editBtnTdElement.appendChild(editBtnElement);

    trElement.appendChild(nameElement);
    trElement.appendChild(casePriceElement);
    trElement.appendChild(wholesalePriceElement);
    trElement.appendChild(retailPriceElement);
    trElement.appendChild(deletebtnTdElement);
    trElement.appendChild(editBtnTdElement);

    itemTableBody.appendChild(trElement);
  });
}

function itemDelete(value) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const res = await apiReq("post", `${apiUrl}/item/delete`, {
        id: value.id,
      });

      await Swal.fire(
        "Deleted!",
        "Your file has been deleted.",
        "success"
      ).then(() => {
        location.reload();
      });
    }
  });
}

function itemFormClear() {
  const formTitle = document.getElementById("addItemsFormTitle");
  formTitle.classList.remove();
  formTitle.classList.add("add-items-form-title");

  document.getElementById("itemName").value = "";
  document.getElementById("itemSearchKeyword").value = "";
  document.getElementById("itemRetailPrice").value = "";
  document.getElementById("itemwholesalePrice").value = "";
  document.getElementById("ItemQuantity").value = "";
  document.getElementById("itemUnitPriceOptions").innerHTML = "";
  document.getElementById("priceByRangeOptionInputCon").innerHTML = "";
  document.getElementById("itemNote").value = "";
  document.getElementById("formSubmitBtnContainer").innerHTML = "";
  document.getElementById("casePrice").value = "";
}

function itemEdit(value) {
  const formTitle = document.getElementById("addItemsFormTitle");
  formTitle.classList.remove();
  formTitle.classList.add("update-items-form-title");

  document.getElementById("itemName").value = value.name;

  document.getElementById("itemSearchKeyword").value = JSON.parse(
    value.keywords
  );

  document.getElementById("itemRetailPrice").value = value.retail_price;

  document.getElementById("itemwholesalePrice").value = value.wholesale_price;
  document.getElementById("casePrice").value = value.case_price;

  document.getElementById("ItemQuantity").value = value.quantity;
  pricePerUnitContainerCreate("", "itemEdit", value.price_per_unit);
  rangeByPriceInputContainerCreate(
    "",
    "itemEdit",
    JSON.parse(value.price_by_range)
  );
  const itemAvalability = document.getElementById("itemAvalability");
  const itemAvalabilityOptions = itemAvalability.getElementsByTagName("option");
  if (value.availability) {
    itemAvalability.style.backgroundColor = "green";
    itemAvalability.style.color = "white";
  } else {
    itemAvalability.style.backgroundColor = "red";
    itemAvalability.style.color = "white";
  }

  [...itemAvalabilityOptions].forEach((element, i) => {
    if (element.value == value.availability.toString()) {
      element.selected = "selected";
    }
  });

  document.getElementById("itemNote").value = value.note;

  const cancelBtn = document.createElement("input");
  cancelBtn.type = "submit";
  cancelBtn.value = "Cancel ";
  cancelBtn.classList.add("update-cancel-btn");
  cancelBtn.onclick = (e) => {
    e.preventDefault();
    location.reload();
  };

  const updateItemFormSubmitBtn = document.createElement("input");
  updateItemFormSubmitBtn.type = "submit";
  updateItemFormSubmitBtn.id = value.id;
  updateItemFormSubmitBtn.value = "යාවත්කාලීන කරන්න";
  updateItemFormSubmitBtn.classList.add("update-item-form-submit");
  updateItemFormSubmitBtn.onclick = (e) => {
    e.preventDefault();
    itemFormSubmitBtnFun("updateItem", e.target.id);
  };

  const formSubmitBtnCon = document.querySelectorAll(".form-submit-btn")[0];
  formSubmitBtnCon.appendChild(cancelBtn);
  formSubmitBtnCon.appendChild(updateItemFormSubmitBtn);
}

function disableEditBtns() {
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.disabled = true;
  });
}

document.getElementById("itemwholesalePrice").addEventListener("input", (e) => {
  document.getElementById("itemwholesalePriceLable0").innerText =
    e.target.value;
});

//change btn color
document.getElementById("itemAvalability").addEventListener("change", (e) => {
  avalabilityBtnColorChange(e.target);
});

function avalabilityBtnColorChange(dom) {
  if (dom.value === "true") {
    dom.style.backgroundColor = "green";
    dom.style.color = "white";
  } else if (dom.value === "false") {
    dom.style.backgroundColor = "red";
    dom.style.color = "white";
  }
}

const rangePrePriceFvalueChangeRealtime = () => {
  const unitPerPriceInputSElements = document.querySelectorAll(
    ".unit-per-price-inputS"
  );
  unitPerPriceInputSElements.forEach((element, i) => {
    element.addEventListener("input", () => {
      if (document.getElementById(`unitPerPriceInputF${i + 1}`)) {
        document.getElementById(`unitPerPriceInputF${i + 1}`).style.color =
          "white";
        document.getElementById(`unitPerPriceInputF${i + 1}`).value =
          element.value;
      } else {
      }
    });
  });
};

rangePrePriceFvalueChangeRealtime();

// ======================== Unit Price Plus Btn ========================
let unitOptionId = 0;
document.getElementById("itemUnitPricePlus").addEventListener("click", (e) => {
  e.preventDefault();
  unitOptionId++;

  pricePerUnitContainerCreate(unitOptionId, "unitPricePlusBtn", {});
});

function pricePerUnitContainerCreate(unitOptionId, status, pricePerUnitValues) {
  const optionArry = [
    "මිටි",
    "කිලෝ",
    "කේස්",
    "පැකට්",
    "බන්ඩල්",
    "කෑලි",
    "කාඩ්",
    "බෝතල්",
    "පැක්",
    "Gross",
    "වැල්",
    "වැල් පැකට්",
    "කැට",
    "ටින්",
    "කොල",
    "පෙට්ටි",
    "කප්",
    " ",
  ];

  if (status == "unitPricePlusBtn") {
    const selectElem = document.createElement(`select`);
    selectElem.id = `unitOptionSelect${unitOptionId}`;
    selectElem.classList.add("unitOptionSelectClass");
    selectElem.classList.add("green-input");

    for (let i = 0; i < optionArry.length; i++) {
      const optionElem = document.createElement("option");
      optionElem.value = optionArry[i];
      optionElem.innerText = optionArry[i];
      selectElem.appendChild(optionElem);
    }

    const divElem = document.createElement("div");
    divElem.classList.add("item-unit-price-options-second-div");
    const inputElem = document.createElement("input");
    inputElem.type = "number";
    inputElem.classList.add("unitOptionInputClass");
    inputElem.classList.add("green-input");
    inputElem.id = `unitoptionInput${unitOptionId}`;

    const btnElem = document.createElement("button");
    btnElem.classList.add("option-close-btn");
    btnElem.id = unitOptionId;
    btnElem.innerText = "X";
    btnElem.onclick = (e) => {
      document.getElementById(`unitOptionSelect${e.target.id}`).remove();
      document.getElementById(`unitoptionInput${e.target.id}`).remove();
      e.target.remove();
    };

    divElem.appendChild(selectElem);
    divElem.appendChild(inputElem);
    divElem.appendChild(btnElem);
    const itemUnitPriceOptions = document.getElementById(
      "itemUnitPriceOptions"
    );
    itemUnitPriceOptions.appendChild(divElem);
  } else {
    const tepObj = JSON.parse(pricePerUnitValues);

    // cover obg to arry
    const arr = Object.entries(tepObj).map(function (key, count) {
      return { name: key[0], value: key[1] };
    });

    arr.forEach((value, x) => {
      const selectElem = document.createElement(`select`);
      selectElem.id = `unitOptionSelect${x}`;
      selectElem.classList.add("unitOptionSelectClass");
      selectElem.classList.add("green-input");

      const name = arr[x].name;

      for (let i = 0; i < optionArry.length; i++) {
        const optionElem = document.createElement("option");
        optionElem.value = optionArry[i];
        optionElem.innerText = optionArry[i];
        selectElem.appendChild(optionElem);

        if (name == optionArry[i]) {
          optionElem.selected = "selected";
        }
      }

      const divElem = document.createElement("div");
      divElem.classList.add("item-unit-price-options-second-div");
      const inputElem = document.createElement("input");
      inputElem.type = "number";
      inputElem.classList.add("unitOptionInputClass");
      inputElem.classList.add("green-input");
      inputElem.id = `unitoptionInput${x}`;
      inputElem.value = value.value;

      const btnElem = document.createElement("button");
      btnElem.classList.add("option-close-btn");
      btnElem.id = x;
      btnElem.innerText = "X";
      btnElem.onclick = (e) => {
        document.getElementById(`unitOptionSelect${e.target.id}`).remove();
        document.getElementById(`unitoptionInput${e.target.id}`).remove();
        e.target.remove();
      };

      divElem.appendChild(selectElem);
      divElem.appendChild(inputElem);
      divElem.appendChild(btnElem);
      const itemUnitPriceOptions = document.getElementById(
        "itemUnitPriceOptions"
      );
      itemUnitPriceOptions.appendChild(divElem);
    });
  }
}

// =====================unitPricePlusEvent=====================
let unitPerPriceId = 0;
document.getElementById("unitPerPricePlus").addEventListener("click", (e) => {
  e.preventDefault();
  // unitPerPriceId++;

  document
    .getElementById("itemwholesalePrice")
    .addEventListener("input", (e) => {
      document.querySelectorAll('span[class="iwpl"]').forEach((element) => {
        element.innerText = e.target.value;
      });
    });

  rangeByPriceInputContainerCreate(unitPerPriceId, "unitPerPricePlus", {});

  rangePrePriceFvalueChangeRealtime();
});

function rangeByPriceInputContainerCreate(
  unitPerPriceId,
  status,
  priceByRangeValues
) {
  // check the how much container are there
  unitPerPriceId += document.querySelectorAll(".unit-per-price-inputF").length;

  priceByRangeOptionInputCon = document.getElementById(
    "priceByRangeOptionInputCon"
  );

  let itemwholesalePriceValue =
    document.getElementById("itemwholesalePrice").value;

  if (status == "unitPerPricePlus") {
    const inputEle1Id = `unitPerPriceInputF${unitPerPriceId}`;
    const inputEle2Id = `unitPerPriceInputS${unitPerPriceId}`;
    const inputEle3Id = `unitPerPriceRangePrice${unitPerPriceId}`;
    let unitPerPriceInputSValue = document.getElementById(
      `unitPerPriceInputS${unitPerPriceId - 1}`
    ).value;

    const divElem = document.createElement("div");
    divElem.id = `priceByRangeOptionInputConSecond${unitPerPriceId}`;
    divElem.classList.add("price-by-range-option-InputConSecond");

    inputElementF = document.createElement("input");
    inputElementF.type = "number";
    inputElementF.disabled = true;
    inputElementF.value = unitPerPriceInputSValue;
    inputElementF.id = inputEle1Id;
    inputElementF.classList.add("unit-per-price-inputF");

    toSpanElement = document.createElement("span");
    toSpanElement.innerText = "TO";

    inputElementS = document.createElement("input");
    inputElementS.type = "number";
    inputElementS.id = inputEle2Id;
    inputElementS.classList.add("unit-per-price-inputS");

    equalSpan = document.createElement("span");
    equalSpan.innerText = "=";

    itemwholesalePriceSpanElement = document.createElement("span");
    itemwholesalePriceSpanElement.id = `itemwholesalePriceLable${unitPerPriceId}`;
    itemwholesalePriceSpanElement.classList.add("iwpl");
    itemwholesalePriceSpanElement.innerText = itemwholesalePriceValue;

    plusSpan = document.createElement("span");
    plusSpan.innerText = "+";

    rangePerPriceInputElement = document.createElement("input");
    rangePerPriceInputElement.type = "number";
    rangePerPriceInputElement.id = inputEle3Id;
    rangePerPriceInputElement.classList.add("unit-per-price-range-price");

    const btnElem = document.createElement("button");
    btnElem.innerText = "X";
    btnElem.classList.add("price-range-close-btn");
    btnElem.id = unitPerPriceId;
    btnElem.onclick = (e) => {
      priceByRangeCloseBtn(e, "addItem");
    };

    divElem.appendChild(inputElementF);
    divElem.appendChild(toSpanElement);
    divElem.appendChild(inputElementS);
    divElem.appendChild(equalSpan);
    divElem.appendChild(itemwholesalePriceSpanElement);
    divElem.appendChild(plusSpan);
    divElem.appendChild(rangePerPriceInputElement);

    divElem.appendChild(btnElem);
    priceByRangeOptionInputCon.appendChild(divElem);
  } else {
    // document.getElementById("priceByRangeOptionInputConSecond0").remove();

    priceByRangeValues.forEach((priceByRangeValue, index) => {
      const inputEle1Id = `unitPerPriceInputF${index}`;
      const inputEle2Id = `unitPerPriceInputS${index}`;
      const inputEle3Id = `unitPerPriceRangePrice${index}`;

      const divElem = document.createElement("div");
      divElem.id = `priceByRangeOptionInputConSecond${index}`;
      divElem.classList.add("price-by-range-option-InputConSecond");

      inputElementF = document.createElement("input");
      inputElementF.type = "number";
      inputElementF.disabled = true;
      inputElementF.value = priceByRangeValue.minQty;
      inputElementF.id = inputEle1Id;
      inputElementF.classList.add("unit-per-price-inputF");

      toSpanElement = document.createElement("span");
      toSpanElement.innerText = "TO";

      inputElementS = document.createElement("input");
      inputElementS.type = "number";
      inputElementS.id = inputEle2Id;
      inputElementS.classList.add("unit-per-price-inputS");
      inputElementS.value = priceByRangeValue.maxQty;

      equalSpan = document.createElement("span");
      equalSpan.innerText = "=";

      itemwholesalePriceSpanElement = document.createElement("span");
      itemwholesalePriceSpanElement.id = `itemwholesalePriceLable${index}`;
      itemwholesalePriceSpanElement.classList.add("iwpl");
      itemwholesalePriceSpanElement.innerText = itemwholesalePriceValue;

      plusSpan = document.createElement("span");
      plusSpan.innerText = "+";

      rangePerPriceInputElement = document.createElement("input");
      rangePerPriceInputElement.type = "number";
      rangePerPriceInputElement.id = inputEle3Id;
      rangePerPriceInputElement.classList.add("unit-per-price-range-price");
      rangePerPriceInputElement.value = priceByRangeValue.price;

      const btnElem = document.createElement("button");
      btnElem.innerText = "X";
      btnElem.classList.add("price-range-close-btn");
      btnElem.id = index;
      btnElem.onclick = (e) => {
        priceByRangeCloseBtn(e, "update");
      };

      divElem.appendChild(inputElementF);
      divElem.appendChild(toSpanElement);
      divElem.appendChild(inputElementS);
      divElem.appendChild(equalSpan);
      divElem.appendChild(itemwholesalePriceSpanElement);
      divElem.appendChild(plusSpan);
      divElem.appendChild(rangePerPriceInputElement);

      divElem.appendChild(btnElem);
      priceByRangeOptionInputCon.appendChild(divElem);
    });
  }
}

function priceByRangeCloseBtn(e, status) {
  document.getElementById(`unitPerPriceInputF${e.target.id}`).remove();
  document.getElementById(`unitPerPriceInputS${e.target.id}`).remove();
  document.getElementById(`unitPerPriceRangePrice${e.target.id}`).remove();
  e.target.remove();
  document
    .getElementById(`priceByRangeOptionInputConSecond${e.target.id}`)
    .remove();

  const divElmentArry = document.querySelectorAll(
    ".price-by-range-option-InputConSecond"
  );

  if (status == "addItem") {
    divElmentArry.forEach((element, index) => {
      element.id = `priceByRangeOptionInputConSecond${index}`;
    });
  } else {
    divElmentArry.forEach((element, index) => {
      element.id = `priceByRangeOptionInputConSecond${index}`;
    });
  }

  const inputSArry = document.querySelectorAll(".unit-per-price-inputS");
  inputSArry.forEach((element, index) => {
    element.id = `unitPerPriceInputS${index}`;
  });

  const inputFArry = document.querySelectorAll(".unit-per-price-inputF");
  inputFArry.forEach((e, i) => {
    e.id = `unitPerPriceInputF${i}`;
  });

  const rangePriceArry = document.querySelectorAll(
    ".unit-per-price-range-price"
  );
  rangePriceArry.forEach((e, i) => {
    e.id = `unitPerPriceRangePrice${i}`;
  });

  if (status == "addItem") {
    const closeBtnArry = document.querySelectorAll(".price-range-close-btn");
    closeBtnArry.forEach((e, i) => {
      e.id = i + 1;
    });
  } else {
    const closeBtnArry = document.querySelectorAll(".price-range-close-btn");
    closeBtnArry.forEach((e, i) => {
      e.id = i;
    });
  }
}

// form submit
document.getElementById("ItemFormSubmitBtn").addEventListener("click", (e) => {
  e.preventDefault();
  itemFormSubmitBtnFun("addItem", "");
});

const itemFormSubmitBtnFun = async (status, itemId) => {
  const itemName = document.getElementById("itemName").value;
  const itemSearchKeyword = document.getElementById("itemSearchKeyword").value;
  const itemRetailPrice = document.getElementById("itemRetailPrice").value;
  const itemwholesalePrice =
    document.getElementById("itemwholesalePrice").value;
  const ItemQuantity = document.getElementById("ItemQuantity").value;
  const itemUnitPriceSelectElements = document.querySelectorAll(
    ".unitOptionSelectClass"
  );
  const unitOptionInputElements = document.querySelectorAll(
    ".unitOptionInputClass"
  );

  const unitPerPriceInputFElement = document.querySelectorAll(
    ".unit-per-price-inputF"
  );
  const unitPerPriceInputSElement = document.querySelectorAll(
    ".unit-per-price-inputS"
  );
  const unitPerPriceRangePriceElement = document.querySelectorAll(
    ".unit-per-price-range-price"
  );
  const itemAvalability = document.getElementById("itemAvalability").value;

  const itemNote = document.getElementById("itemNote").value;

  const casePrice = document.getElementById("casePrice").value;

  const itemUnitPriceData = getUnitPerPrice(
    itemUnitPriceSelectElements,
    unitOptionInputElements
  );

  const searchKeywordsArry = searchKeywordToArry(itemSearchKeyword);

  const PriceByRangeData = getPriceByRangeData(
    unitPerPriceInputFElement,
    unitPerPriceInputSElement,
    unitPerPriceRangePriceElement
  );

  const data = {
    name: itemName,
    keywords: searchKeywordsArry,
    retailPrice: itemRetailPrice,
    wholesalePrice: itemwholesalePrice,
    quantity: ItemQuantity,
    pricePerUnit: itemUnitPriceData,
    priceByRange: PriceByRangeData,
    availability: itemAvalability,
    note: itemNote,
    casePrice: parseInt(casePrice),
  };

  if (status == "addItem") {
    const apiResponse = await apiReq("post", `${apiUrl}/item/add`, data);
    if (apiResponse.status) {
      await Swal.fire("Added!", `${apiResponse.message}`, "success").then(
        () => {
          location.reload();
        }
      );
    } else {
      await Swal.fire("Not Added!", `${apiResponse.message}`, "warning").then(
        () => {
          location.reload();
        }
      );
    }
  } else {
    data.id = itemId;

    console.log(data);

    const apiResponse = await apiReq("post", `${apiUrl}/item/update`, data);
    if (apiResponse.status) {
      await Swal.fire("Added!", `${apiResponse.message}`, "success").then(
        () => {
          location.reload();
        }
      );
    } else {
      await Swal.fire("Not Added!", `${apiResponse.message}`, "warning").then(
        () => {
          location.reload();
        }
      );
    }
  }
};

const searchKeywordToArry = (keywords) => {
  const temArry = keywords.split(",");
  return temArry;
};

const getPriceByRangeData = (
  unitPerPriceInputFElement,
  unitPerPriceInputSElement,
  unitPerPriceRangePriceElement
) => {
  const priceByRangeArry = [];
  for (let i = 0; i < unitPerPriceInputFElement.length; i++) {
    let obg = {
      minQty: unitPerPriceInputFElement[i].value,
      maxQty: unitPerPriceInputSElement[i].value,
      price: unitPerPriceRangePriceElement[i].value,
    };

    priceByRangeArry.push(obg);
  }
  return priceByRangeArry;
};

const getUnitPerPrice = (
  itemUnitPriceSelectElements,
  unitOptionInputElements
) => {
  const itemUnitPriceObg = {};
  for (i = 0; i < itemUnitPriceSelectElements.length; i++) {
    let selectValue = itemUnitPriceSelectElements[i].value;
    let inputValue = unitOptionInputElements[i].value;
    itemUnitPriceObg[selectValue] = inputValue;
  }
  return itemUnitPriceObg;
};
