// generate date and instert copyright notice into the footer:
const addCopyrightNote = () => {
  let currentDate = new Date().getFullYear();
/*   let copyrightNote = document.createElement('span');
  let copyrightContent = document.createTextNode(`${currentDate} Raphael Hemme`);
  copyrightNote.appendChild(copyrightContent)
  let footer = document.getElementsByTagName('footer')[0];
  footer.appendChild(copyrightNote) */
  let footer = document.getElementsByTagName('footer')[0];
  footer.innerHTML = `<p>&#xa9; ${currentDate} Raphael Hemme</p>`
}

addCopyrightNote();

