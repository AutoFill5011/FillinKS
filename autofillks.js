javascript:(async function(){
  function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

  function setNativeValue(el,val){
    const proto = Object.getPrototypeOf(el);
    const desc =
      Object.getOwnPropertyDescriptor(proto,'value') ||
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value');
    if(desc && desc.set) desc.set.call(el,val);
    else el.value = val;
    el.dispatchEvent(new Event('input',{bubbles:true}));
    el.dispatchEvent(new Event('change',{bubbles:true}));
  }

  function pressEnter(el){
    el.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',keyCode:13,which:13,bubbles:true}));
    el.dispatchEvent(new KeyboardEvent('keyup',{key:'Enter',keyCode:13,which:13,bubbles:true}));
  }

  function inputByForm(name){
    return document.querySelector("input[formcontrolname='"+name+"']");
  }

  function vtsByIndex(i){
    return document.querySelectorAll(
      "vts-select-top-control input.vts-select-selection-search-input"
    )[i];
  }

  try{
    alert("Autofill: first 7 fields");

    // ---- TEXT FIELDS ----
    setNativeValue(inputByForm('rpFirstName'),'Nguyễn');
    setNativeValue(inputByForm('rpMiddleName'),'Quang');
    setNativeValue(inputByForm('rpLastName'),'Hiệp');
    setNativeValue(inputByForm('rpBirthYear'),'2025');

    await sleep(120);

    // ---- DROPDOWNS (INDEX-BASED, STABLE) ----
    // index order YOU already discovered:
    // 0 = Day, 1 = Month, 2 = Gender

    let day = vtsByIndex(0);
    day.focus(); setNativeValue(day,'20'); pressEnter(day);
    await sleep(120);

    let month = vtsByIndex(1);
    month.focus(); setNativeValue(month,'03'); pressEnter(month);
    await sleep(120);

    let gender = vtsByIndex(2);
    gender.focus(); setNativeValue(gender,'Nam'); pressEnter(gender);

    alert("DONE — first 7 fields filled correctly");

  }catch(e){
    alert("ERROR: "+e);
    console.error(e);
  }
})();
