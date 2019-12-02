/*global flowy*/

$(document).ready(() => {
  let rightCard = false;
  let tempBlock;
  let tempBlock2;

  // $('#blocklist').html(
  //   '<div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="1"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/eye.svg"></div><div class="blocktext">                        <p class="blocktitle">New visitor</p><p class="blockdesc">Triggers when somebody visits a specified page</p>        </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="2"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                    <div class="blockico"><span></span><img src="assets/action.svg"></div><div class="blocktext">                        <p class="blocktitle">Action is performed</p><p class="blockdesc">Triggers when somebody performs a specified action</p></div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="3"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                    <div class="blockico"><span></span><img src="assets/time.svg"></div><div class="blocktext">                        <p class="blocktitle">Time has passed</p><p class="blockdesc">Triggers after a specified amount of time</p>          </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="4"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                    <div class="blockico"><span></span><img src="assets/error.svg"></div><div class="blocktext">                        <p class="blocktitle">Error prompt</p><p class="blockdesc">Triggers when a specified error happens</p>              </div></div></div>'
  // );

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

    const id = clickedElement.getAttribute('id');

    if (id === 'triggers') {
      $('#blocklist').html(
        '<div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="1"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/eye.svg"></div><div class="blocktext">                        <p class="blocktitle">New visitor</p><p class="blockdesc">Triggers when somebody visits a specified page</p>        </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="2"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                    <div class="blockico"><span></span><img src="assets/action.svg"></div><div class="blocktext">                        <p class="blocktitle">Action is performed</p><p class="blockdesc">Triggers when somebody performs a specified action</p></div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="3"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                    <div class="blockico"><span></span><img src="assets/time.svg"></div><div class="blocktext">                        <p class="blocktitle">Time has passed</p><p class="blockdesc">Triggers after a specified amount of time</p>          </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="4"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                    <div class="blockico"><span></span><img src="assets/error.svg"></div><div class="blocktext">                        <p class="blocktitle">Error prompt</p><p class="blockdesc">Triggers when a specified error happens</p>              </div></div></div>'
      );
    } else if (id === 'actions') {
      $('#blocklist').html(
        '<div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="5"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/database.svg"></div><div class="blocktext">                        <p class="blocktitle">New database entry</p><p class="blockdesc">Adds a new entry to a specified database</p>        </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="6"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/database.svg"></div><div class="blocktext">                        <p class="blocktitle">Update database</p><p class="blockdesc">Edits and deletes database entries and properties</p>        </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="7"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/action.svg"></div><div class="blocktext">                        <p class="blocktitle">Perform an action</p><p class="blockdesc">Performs or edits a specified action</p>        </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="8"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/twitter.svg"></div><div class="blocktext">                        <p class="blocktitle">Make a tweet</p><p class="blockdesc">Makes a tweet with a specified query</p>        </div></div></div>'
      );
    } else if (id === 'loggers') {
      $('#blocklist').html(
        '<div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="9"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/log.svg"></div><div class="blocktext">                        <p class="blocktitle">Add new log entry</p><p class="blockdesc">Adds a new log entry to this project</p>        </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="10"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/log.svg"></div><div class="blocktext">                        <p class="blocktitle">Update logs</p><p class="blockdesc">Edits and deletes log entries in this project</p>        </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="11"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/error.svg"></div><div class="blocktext">                        <p class="blocktitle">Prompt an error</p><p class="blockdesc">Triggers a specified error</p>        </div></div></div>'
      );
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
