/*global flowy*/

$(document).ready(() => {
  let rightCard = false;
  let tempBlock;
  let tempBlock2;

  flowy($('#canvas'), drag, release, snapping);

  function snapping(drag) {
    drag.children('.grabme').remove();
    drag.children('.blockin').remove();

    const blockType = drag.children('.blockelemtype').val();

    if (blockType === '1') {
      drag.append(
        "<div class='blockyleft'><img src='assets/eyeblue.svg'><p class='blockyname'>New visitor</p></div><div class='blockyright'><img src='assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'>When a <span>new visitor</span> goes to <span>Site 1</span></div>"
      );
    } else if (blockType === '2') {
      drag.append(
        "<div class='blockyleft'><img src='assets/actionblue.svg'><p class='blockyname'>Action is performed</p></div><div class='blockyright'><img src='assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'>When <span>Action 1</span> is performed</div>"
      );
    } else if (blockType === '3') {
      drag.append(
        "<div class='blockyleft'><img src='assets/timeblue.svg'><p class='blockyname'>Time has passed</p></div><div class='blockyright'><img src='assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'>When <span>10 seconds</span> have passed</div>"
      );
    } else if (blockType === '4') {
      drag.append(
        "<div class='blockyleft'><img src='assets/errorblue.svg'><p class='blockyname'>Error prompt</p></div><div class='blockyright'><img src='assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'>When <span>Error 1</span> is triggered</div>"
      );
    } else if (blockType === '5') {
      drag.append(
        "<div class='blockyleft'><img src='assets/databaseorange.svg'><p class='blockyname'>New database entry</p></div><div class='blockyright'><img src='assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'>Add <span>Data object</span> to <span>Database 1</span></div>"
      );
    } else if (blockType === '6') {
      drag.append(
        "<div class='blockyleft'><img src='assets/databaseorange.svg'><p class='blockyname'>Update database</p></div><div class='blockyright'><img src='assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'>Update <span>Database 1</span></div>"
      );
    } else if (blockType === '7') {
      drag.append(
        "<div class='blockyleft'><img src='assets/actionorange.svg'><p class='blockyname'>Perform an action</p></div><div class='blockyright'><img src='assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'>Perform <span>Action 1</span></div>"
      );
    } else if (blockType === '8') {
      drag.append(
        "<div class='blockyleft'><img src='assets/twitterorange.svg'><p class='blockyname'>Make a tweet</p></div><div class='blockyright'><img src='assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'>Tweet <span>Query 1</span> with the account <span>@DenysVuika</span></div>"
      );
    } else if (blockType === '9') {
      drag.append(
        "<div class='blockyleft'><img src='assets/logred.svg'><p class='blockyname'>Add new log entry</p></div><div class='blockyright'><img src='assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'>Add new <span>success</span> log entry</div>"
      );
    } else if (blockType === '10') {
      drag.append(
        "<div class='blockyleft'><img src='assets/logred.svg'><p class='blockyname'>Update logs</p></div><div class='blockyright'><img src='assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'>Edit <span>Log Entry 1</span></div>"
      );
    } else if (blockType === '11') {
      drag.append(
        "<div class='blockyleft'><img src='assets/errorred.svg'><p class='blockyname'>Prompt an error</p></div><div class='blockyright'><img src='assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'>Trigger <span>Error 1</span></div>"
      );
    }
  }

  function drag(block) {
    block.addClass('blockdisabled');
    tempBlock2 = block;
  }

  function release() {
    tempBlock2.removeClass('blockdisabled');
  }

  $(document).on('click', '.navdisabled', event => {
    document.querySelectorAll('.navactive').forEach(el => {
      el.classList.add('navdisabled');
      el.classList.remove('navactive');
    });

    const clickedElement = event.currentTarget;

    clickedElement.classList.add('navactive');
    clickedElement.classList.remove('navdisabled');

    document.querySelectorAll('.toolbox-panel').forEach(el => {
      el.classList.add('hidden');
    });

    const id = clickedElement.getAttribute('id');
    const tab = document.querySelector(`#tab-${id}`);
    if (tab) {
      tab.classList.remove('hidden');
    }
  });

  $('#close').click(() => {
    if (rightCard) {
      rightCard = false;
      $('#properties').removeClass('expanded');

      setTimeout(() => {
        $('#propwrap').removeClass('itson');
      }, 300);

      tempBlock.removeClass('selectedblock');
    }
  });

  $('#removeblock').on('click', () => {
    flowy.deleteBlocks();
  });

  $(document).on('mousedown', '.block', (/*event*/) => {
    $(document).on('mouseup mousemove', '.block', function handler(event) {
      if (event.type === 'mouseup') {
        if (!rightCard) {
          tempBlock = $(this);
          rightCard = true;
          $('#properties').addClass('expanded');
          $('#propwrap').addClass('itson');
          tempBlock.addClass('selectedblock');
        }
      }
      $(document).off('mouseup mousemove', handler);
    });
  });
});
