import './flowy.css';

const flowy = (canvas, grab, release, snapping, spacing_x, spacing_y) => {
  if (!grab) {
    grab = function() {};
  }
  if (!release) {
    release = function() {};
  }
  if (!snapping) {
    snapping = function() {};
  }
  if (!spacing_x) {
    spacing_x = 20;
  }
  if (!spacing_y) {
    spacing_y = 80;
  }

  $(document).ready(() => {
    let blocks = [];
    let blocksTemp = [];
    const canvas_div = canvas;
    let active = false;
    const paddingX = spacing_x;
    const paddingY = spacing_y;
    let offsetLeft = 0;
    let offsetLeftOld = 0;
    let rearrange = false;
    let lastEvent = false;
    let drag, dragX, dragY, original;
    let uid = -1;

    canvas_div.append("<div class='indicator invisible'></div>");

    flowy.output = function() {
      const json_data = [];

      if (blocks.length > 0) {
        for (let i = 0; i < blocks.length; i++) {
          json_data.push({
            id: blocks[i].id,
            parent: blocks[i].parent,
            data: []
          });
          $('.blockid[value=' + blocks[i].id + ']')
            .parent()
            .children('input')
            .each(function() {
              const json_name = $(this).attr('name');
              const json_value = $(this).val();
              json_data[i].data.push({
                name: json_name,
                value: json_value
              });
            });
        }
        return json_data;
      }
    };

    flowy.deleteBlocks = function() {
      blocks = [];
      canvas_div.html("<div class='indicator invisible'></div>");
    };

    $(document).on('mousedown', '.create-flowy', function(event) {
      if (event.which === 1) {
        original = event.currentTarget;

        const newId = ++uid; /*Date.now();*/

        $(this)
          .clone()
          .addClass('block')
          .append(
            `<input type='hidden' name='blockid' class='blockid' value='${newId}'>`
          )
          .removeClass('create-flowy')
          .appendTo('body');

        original.classList.add('dragnow');
        drag = $(`.blockid[value='${newId}']`).parent();

        blockGrabbed($(this));
        drag.addClass('dragging');
        active = true;

        dragX = event.clientX - $(this).offset().left;
        dragY = event.clientY - $(this).offset().top;
        drag.css('left', event.clientX - dragX + 'px');
        drag.css('top', event.clientY - dragY + 'px');
      }
    });

    $(document).on('mouseup', event => {
      if (event.which === 1 && (active || rearrange)) {
        blockReleased();

        if (!$('.indicator').hasClass('invisible')) {
          $('.indicator').addClass('invisible');
        }

        if (active) {
          original.classList.remove('dragnow');
          drag.removeClass('dragging');
        }

        const currentBlockId = parseInt(drag.children('.blockid').val());

        // todo check if root instead (introduce the concept of root node)
        if (currentBlockId == 0 && rearrange) {
          drag.removeClass('dragging');
          rearrange = false;

          for (let i = 0; i < blocksTemp.length; i++) {
            if (blocksTemp[i].id != currentBlockId) {
              const blockElement = $(`.blockid[value='${blocksTemp[i].id}']`);
              const arrowElement = $(`.arrowid[value='${blocksTemp[i].id}']`);

              blockElement
                .parent()
                .css(
                  'left',
                  blockElement.parent().offset().left -
                    canvas_div.offset().left +
                    canvas_div.scrollLeft()
                );
              blockElement
                .parent()
                .css(
                  'top',
                  blockElement.parent().offset().top -
                    canvas_div.offset().top +
                    canvas_div.scrollTop()
                );
              arrowElement
                .parent()
                .css(
                  'left',
                  arrowElement.parent().offset().left -
                    canvas_div.offset().left +
                    canvas_div.scrollLeft()
                );
              arrowElement
                .parent()
                .css(
                  'top',
                  arrowElement.parent().offset().top -
                    canvas_div.offset().top +
                    canvas_div.scrollTop() +
                    'px'
                );
              blockElement.parent().appendTo(canvas_div);
              arrowElement.parent().appendTo(canvas_div);
              blocksTemp[i].x =
                blockElement.parent().offset().left +
                blockElement.innerWidth() / 2 +
                canvas_div.scrollLeft();
              blocksTemp[i].y =
                blockElement.parent().offset().top +
                blockElement.parent().innerHeight() / 2 +
                canvas_div.scrollTop();
            }
          }
          blocksTemp.filter(a => a.id == 0)[0].x =
            drag.offset().left + drag.innerWidth() / 2;
          blocksTemp.filter(a => a.id == 0)[0].y =
            drag.offset().top + drag.innerHeight() / 2;
          blocks = $.merge(blocks, blocksTemp);
          blocksTemp = [];
        } else if (
          active &&
          blocks.length == 0 &&
          drag.offset().top > canvas_div.offset().top &&
          drag.offset().left > canvas_div.offset().left
        ) {
          blockSnap(drag);
          active = false;
          drag.css(
            'top',
            drag.offset().top -
              canvas_div.offset().top +
              canvas_div.scrollTop() +
              'px'
          );
          drag.css(
            'left',
            drag.offset().left -
              canvas_div.offset().left +
              canvas_div.scrollLeft() +
              'px'
          );
          drag.appendTo(canvas_div);
          blocks.push({
            parent: -1,
            childwidth: 0,
            id: currentBlockId,
            x:
              drag.offset().left +
              drag.innerWidth() / 2 +
              canvas_div.scrollLeft(),
            y:
              drag.offset().top +
              drag.innerHeight() / 2 +
              canvas_div.scrollTop(),
            width: drag.innerWidth(),
            height: drag.innerHeight()
          });
        } else if (active && blocks.length == 0) {
          drag.remove();
        } else if (active || rearrange) {
          const xPos =
            drag.offset().left +
            drag.innerWidth() / 2 +
            canvas_div.scrollLeft();
          const yPos = drag.offset().top + canvas_div.scrollTop();
          const blockIds = blocks.map(a => a.id);

          for (let i = 0; i < blocks.length; i++) {
            if (
              xPos >=
                blocks.filter(a => a.id == blockIds[i])[0].x -
                  blocks.filter(a => a.id == blockIds[i])[0].width / 2 -
                  paddingX &&
              xPos <=
                blocks.filter(a => a.id == blockIds[i])[0].x +
                  blocks.filter(a => a.id == blockIds[i])[0].width / 2 +
                  paddingX &&
              yPos >=
                blocks.filter(a => a.id == blockIds[i])[0].y -
                  blocks.filter(a => a.id == blockIds[i])[0].height / 2 &&
              yPos <=
                blocks.filter(a => a.id == blockIds[i])[0].y +
                  blocks.filter(a => a.id == blockIds[i])[0].height
            ) {
              active = false;
              if (!rearrange) {
                blockSnap(drag);
                drag.appendTo(canvas_div);
              }
              let totalWidth = 0;
              let totalRemove = 0;
              // let maxheight = 0;
              for (
                let w = 0;
                w < blocks.filter(id => id.parent == blockIds[i]).length;
                w++
              ) {
                const children = blocks.filter(id => id.parent == blockIds[i])[
                  w
                ];
                if (children.childwidth > children.width) {
                  totalWidth += children.childwidth + paddingX;
                } else {
                  totalWidth += children.width + paddingX;
                }
              }
              totalWidth += drag.innerWidth();
              for (
                let w = 0;
                w < blocks.filter(id => id.parent == blockIds[i]).length;
                w++
              ) {
                const children = blocks.filter(id => id.parent == blockIds[i])[
                  w
                ];
                if (children.childwidth > children.width) {
                  $('.blockid[value=' + children.id + ']')
                    .parent()
                    .css(
                      'left',
                      blocks.filter(a => a.id == blockIds[i])[0].x -
                        totalWidth / 2 +
                        totalRemove +
                        children.childwidth / 2 -
                        children.width / 2 +
                        'px'
                    );
                  children.x =
                    blocks.filter(id => id.parent == blockIds[i])[0].x -
                    totalWidth / 2 +
                    totalRemove +
                    children.childwidth / 2;
                  totalRemove += children.childwidth + paddingX;
                } else {
                  $('.blockid[value=' + children.id + ']')
                    .parent()
                    .css(
                      'left',
                      blocks.filter(a => a.id == blockIds[i])[0].x -
                        totalWidth / 2 +
                        totalRemove +
                        'px'
                    );
                  children.x =
                    blocks.filter(id => id.parent == blockIds[i])[0].x -
                    totalWidth / 2 +
                    totalRemove +
                    children.width / 2;
                  totalRemove += children.width + paddingX;
                }
              }
              drag.css(
                'left',
                blocks.filter(id => id.id == blockIds[i])[0].x -
                  totalWidth / 2 +
                  totalRemove -
                  canvas_div.offset().left +
                  canvas_div.scrollLeft() +
                  'px'
              );
              drag.css(
                'top',
                blocks.filter(id => id.id == blockIds[i])[0].y +
                  blocks.filter(id => id.id == blockIds[i])[0].height / 2 +
                  paddingY -
                  canvas_div.offset().top +
                  'px'
              );
              if (rearrange) {
                blocksTemp.filter(
                  a => a.id == parseInt(drag.children('.blockid').val())
                )[0].x =
                  drag.offset().left +
                  drag.innerWidth() / 2 +
                  canvas_div.scrollLeft() +
                  canvas_div.scrollLeft();
                blocksTemp.filter(
                  a => a.id == parseInt(drag.children('.blockid').val())
                )[0].y =
                  drag.offset().top +
                  drag.innerHeight() / 2 +
                  canvas_div.scrollTop();
                blocksTemp.filter(
                  a => a.id == drag.children('.blockid').val()
                )[0].parent = blockIds[i];
                for (let w = 0; w < blocksTemp.length; w++) {
                  if (
                    blocksTemp[w].id !=
                    parseInt(drag.children('.blockid').val())
                  ) {
                    $('.blockid[value=' + blocksTemp[w].id + ']')
                      .parent()
                      .css(
                        'left',
                        $('.blockid[value=' + blocksTemp[w].id + ']')
                          .parent()
                          .offset().left -
                          canvas_div.offset().left +
                          canvas_div.scrollLeft()
                      );
                    $('.blockid[value=' + blocksTemp[w].id + ']')
                      .parent()
                      .css(
                        'top',
                        $('.blockid[value=' + blocksTemp[w].id + ']')
                          .parent()
                          .offset().top -
                          canvas_div.offset().top +
                          canvas_div.scrollTop()
                      );
                    $('.arrowid[value=' + blocksTemp[w].id + ']')
                      .parent()
                      .css(
                        'left',
                        $('.arrowid[value=' + blocksTemp[w].id + ']')
                          .parent()
                          .offset().left -
                          canvas_div.offset().left +
                          canvas_div.scrollLeft() +
                          20
                      );
                    $('.arrowid[value=' + blocksTemp[w].id + ']')
                      .parent()
                      .css(
                        'top',
                        $('.arrowid[value=' + blocksTemp[w].id + ']')
                          .parent()
                          .offset().top -
                          canvas_div.offset().top +
                          canvas_div.scrollTop()
                      );
                    $('.blockid[value=' + blocksTemp[w].id + ']')
                      .parent()
                      .appendTo(canvas_div);
                    $('.arrowid[value=' + blocksTemp[w].id + ']')
                      .parent()
                      .appendTo(canvas_div);
                    blocksTemp[w].x =
                      $('.blockid[value=' + blocksTemp[w].id + ']')
                        .parent()
                        .offset().left +
                      $(
                        '.blockid[value=' + blocksTemp[w].id + ']'
                      ).innerWidth() /
                        2 +
                      canvas_div.scrollLeft();
                    blocksTemp[w].y =
                      $('.blockid[value=' + blocksTemp[w].id + ']')
                        .parent()
                        .offset().top +
                      $('.blockid[value=' + blocksTemp[w].id + ']')
                        .parent()
                        .innerHeight() /
                        2 +
                      canvas_div.scrollTop();
                  }
                }
                blocks = $.merge(blocks, blocksTemp);
                blocksTemp = [];
              } else {
                blocks.push({
                  childwidth: 0,
                  parent: blockIds[i],
                  id: parseInt(drag.children('.blockid').val()),
                  x:
                    drag.offset().left +
                    drag.innerWidth() / 2 +
                    canvas_div.scrollLeft(),
                  y:
                    drag.offset().top +
                    drag.innerHeight() / 2 +
                    canvas_div.scrollTop(),
                  width: drag.innerWidth(),
                  height: drag.innerHeight()
                });
              }
              const arrowHelp = blocks.filter(
                a => a.id == parseInt(drag.children('.blockid').val())
              )[0];
              const arrowX =
                arrowHelp.x - blocks.filter(a => a.id == blockIds[i])[0].x + 20;
              const arrowy =
                arrowHelp.y -
                arrowHelp.height / 2 -
                (blocks.filter(id => id.parent == blockIds[i])[0].y +
                  blocks.filter(id => id.parent == blockIds[i])[0].height / 2) +
                canvas_div.scrollTop();
              if (arrowX < 0) {
                drag.after(
                  '<div class="arrowblock"><input type="hidden" class="arrowid" value="' +
                    drag.children('.blockid').val() +
                    '"><svg preserveaspectratio="none" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M' +
                    (blocks.filter(a => a.id == blockIds[i])[0].x -
                      arrowHelp.x +
                      5) +
                    ' 0L' +
                    (blocks.filter(a => a.id == blockIds[i])[0].x -
                      arrowHelp.x +
                      5) +
                    ' ' +
                    paddingY / 2 +
                    'L5 ' +
                    paddingY / 2 +
                    'L5 ' +
                    arrowy +
                    '" stroke="#C5CCD0" stroke-width="2px"/><path d="M0 ' +
                    (arrowy - 5) +
                    'H10L5 ' +
                    arrowy +
                    'L0 ' +
                    (arrowy - 5) +
                    'Z" fill="#C5CCD0"/></svg></div>'
                );
                $('.arrowid[value=' + drag.children('.blockid').val() + ']')
                  .parent()
                  .css(
                    'left',
                    arrowHelp.x -
                      5 -
                      canvas_div.offset().left +
                      canvas_div.scrollLeft() +
                      'px'
                  );
              } else {
                drag.after(
                  '<div class="arrowblock"><input type="hidden" class="arrowid" value="' +
                    drag.children('.blockid').val() +
                    '"><svg preserveaspectratio="none" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 0L20 ' +
                    paddingY / 2 +
                    'L' +
                    arrowX +
                    ' ' +
                    paddingY / 2 +
                    'L' +
                    arrowX +
                    ' ' +
                    arrowy +
                    '" stroke="#C5CCD0" stroke-width="2px"/><path d="M' +
                    (arrowX - 5) +
                    ' ' +
                    (arrowy - 5) +
                    'H' +
                    (arrowX + 5) +
                    'L' +
                    arrowX +
                    ' ' +
                    arrowy +
                    'L' +
                    (arrowX - 5) +
                    ' ' +
                    (arrowy - 5) +
                    'Z" fill="#C5CCD0"/></svg></div>'
                );
                $(
                  '.arrowid[value=' +
                    parseInt(drag.children('.blockid').val()) +
                    ']'
                )
                  .parent()
                  .css(
                    'left',
                    blocks.filter(a => a.id == blockIds[i])[0].x -
                      20 -
                      canvas_div.offset().left +
                      canvas_div.scrollLeft() +
                      'px'
                  );
              }
              $(
                '.arrowid[value=' +
                  parseInt(drag.children('.blockid').val()) +
                  ']'
              )
                .parent()
                .css(
                  'top',
                  blocks.filter(a => a.id == blockIds[i])[0].y +
                    blocks.filter(a => a.id == blockIds[i])[0].height / 2 +
                    'px'
                );
              if (blocks.filter(a => a.id == blockIds[i])[0].parent != -1) {
                let flag = false;
                let idVal = blockIds[i];
                while (!flag) {
                  if (blocks.filter(a => a.id == idVal)[0].parent == -1) {
                    flag = true;
                  } else {
                    let zWidth = 0;
                    for (
                      let w = 0;
                      w < blocks.filter(id => id.parent == idVal).length;
                      w++
                    ) {
                      const children = blocks.filter(id => id.parent == idVal)[
                        w
                      ];
                      if (children.childwidth > children.width) {
                        if (
                          w ==
                          blocks.filter(id => id.parent == idVal).length - 1
                        ) {
                          zWidth += children.childwidth;
                        } else {
                          zWidth += children.childwidth + paddingX;
                        }
                      } else {
                        if (
                          w ==
                          blocks.filter(id => id.parent == idVal).length - 1
                        ) {
                          zWidth += children.width;
                        } else {
                          zWidth += children.width + paddingX;
                        }
                      }
                    }
                    blocks.filter(a => a.id == idVal)[0].childwidth = zWidth;
                    idVal = blocks.filter(a => a.id == idVal)[0].parent;
                  }
                }
                blocks.filter(id => id.id == idVal)[0].childwidth = totalWidth;
              }
              if (rearrange) {
                rearrange = false;
                drag.removeClass('dragging');
              }
              rearrangeMe();
              checkOffset();
              break;
            } else if (i == blocks.length - 1) {
              if (rearrange) {
                rearrange = false;
                blocksTemp = [];
              }
              active = false;
              drag.remove();
            }
          }
        }
      }
    });

    $(document).on('mousedown', '.block', (/*event*/) => {
      $(document).on('mouseup mousemove', '.block', function handler(event) {
        if (event.type !== 'mouseup') {
          if (event.which === 1) {
            if (!active && !rearrange) {
              rearrange = true;
              drag = $(this);
              drag.addClass('dragging');
              dragX = event.clientX - $(this).offset().left;
              dragY = event.clientY - $(this).offset().top;
              const blockid = parseInt(
                $(this)
                  .children('.blockid')
                  .val()
              );
              drag = $(this);
              blocksTemp.push(blocks.filter(a => a.id == blockid)[0]);
              blocks = $.grep(blocks, e => {
                return e.id != blockid;
              });
              $('.arrowid[value=' + blockid + ']')
                .parent()
                .remove();
              let layer = blocks.filter(a => a.parent == blockid);
              let flag = false;
              let foundIds = [];
              const allIds = [];
              while (!flag) {
                for (let i = 0; i < layer.length; i++) {
                  blocksTemp.push(blocks.filter(a => a.id == layer[i].id)[0]);
                  $('.blockid[value=' + layer[i].id + ']')
                    .parent()
                    .css(
                      'left',
                      $('.blockid[value=' + layer[i].id + ']')
                        .parent()
                        .offset().left - drag.offset().left
                    );
                  $('.blockid[value=' + layer[i].id + ']')
                    .parent()
                    .css(
                      'top',
                      $('.blockid[value=' + layer[i].id + ']')
                        .parent()
                        .offset().top - drag.offset().top
                    );
                  $('.arrowid[value=' + layer[i].id + ']')
                    .parent()
                    .css(
                      'left',
                      $('.arrowid[value=' + layer[i].id + ']')
                        .parent()
                        .offset().left - drag.offset().left
                    );
                  $('.arrowid[value=' + layer[i].id + ']')
                    .parent()
                    .css(
                      'top',
                      $('.arrowid[value=' + layer[i].id + ']')
                        .parent()
                        .offset().top - drag.offset().top
                    );
                  $('.blockid[value=' + layer[i].id + ']')
                    .parent()
                    .appendTo(drag);
                  $('.arrowid[value=' + layer[i].id + ']')
                    .parent()
                    .appendTo(drag);
                  foundIds.push(layer[i].id);
                  allIds.push(layer[i].id);
                }
                if (foundIds.length == 0) {
                  flag = true;
                } else {
                  layer = blocks.filter(a => foundIds.includes(a.parent));
                  foundIds = [];
                }
              }
              for (
                let i = 0;
                i < blocks.filter(a => a.parent == blockid).length;
                i++
              ) {
                const blockNumber = blocks.filter(a => a.parent == blockid)[i];
                blocks = $.grep(blocks, e => {
                  return e.id != blockNumber;
                });
              }
              for (let i = 0; i < allIds.length; i++) {
                const blockNumber = allIds[i];
                blocks = $.grep(blocks, e => {
                  return e.id != blockNumber;
                });
              }
              if (blocks.length > 1) {
                rearrangeMe();
              }
              if (lastEvent) {
                fixOffset();
              }
            }
          }
        }
        $(document).off('mouseup mousemove', handler);
      });
    });

    $(document).on('mousemove', event => {
      if (active) {
        drag.css('left', event.clientX - dragX + 'px');
        drag.css('top', event.clientY - dragY + 'px');
      } else if (rearrange) {
        drag.css(
          'left',
          event.clientX -
            dragX -
            canvas_div.offset().left +
            canvas_div.scrollLeft() +
            'px'
        );
        drag.css(
          'top',
          event.clientY -
            dragY -
            canvas_div.offset().top +
            canvas_div.scrollTop() +
            'px'
        );
        blocksTemp.filter(
          a => a.id == parseInt(drag.children('.blockid').val())
        ).x =
          drag.offset().left + drag.innerWidth() / 2 + canvas_div.scrollLeft();
        blocksTemp.filter(
          a => a.id == parseInt(drag.children('.blockid').val())
        ).y =
          drag.offset().left + drag.innerHeight() / 2 + canvas_div.scrollTop();
      }
      if (active || rearrange) {
        const xPos =
          drag.offset().left + drag.innerWidth() / 2 + canvas_div.scrollLeft();
        const yPos = drag.offset().top + canvas_div.scrollTop();
        const blocko = blocks.map(a => a.id);
        for (let i = 0; i < blocks.length; i++) {
          if (
            xPos >=
              blocks.filter(a => a.id == blocko[i])[0].x -
                blocks.filter(a => a.id == blocko[i])[0].width / 2 -
                paddingX &&
            xPos <=
              blocks.filter(a => a.id == blocko[i])[0].x +
                blocks.filter(a => a.id == blocko[i])[0].width / 2 +
                paddingX &&
            yPos >=
              blocks.filter(a => a.id == blocko[i])[0].y -
                blocks.filter(a => a.id == blocko[i])[0].height / 2 &&
            yPos <=
              blocks.filter(a => a.id == blocko[i])[0].y +
                blocks.filter(a => a.id == blocko[i])[0].height
          ) {
            $('.indicator').appendTo(
              $('.blockid[value=' + blocko[i] + ']').parent()
            );
            $('.indicator').css(
              'left',
              $('.blockid[value=' + blocko[i] + ']')
                .parent()
                .innerWidth() /
                2 -
                5 +
                'px'
            );
            $('.indicator').css(
              'top',
              $('.blockid[value=' + blocko[i] + ']')
                .parent()
                .innerHeight() + 'px'
            );
            $('.indicator').removeClass('invisible');
            break;
          } else if (i == blocks.length - 1) {
            if (!$('.indicator').hasClass('invisible')) {
              $('.indicator').addClass('invisible');
            }
          }
        }
      }
    });

    function checkOffset() {
      offsetLeft = blocks.map(a => a.x);

      const widths = blocks.map(a => a.width);
      const mathMin = offsetLeft.map((item, index) => {
        return item - widths[index] / 2;
      });

      offsetLeft = Math.min.apply(Math, mathMin);
      if (offsetLeft < canvas_div.offset().left) {
        lastEvent = true;
        const blocko = blocks.map(a => a.id);
        for (let w = 0; w < blocks.length; w++) {
          $(
            '.blockid[value=' +
              blocks.filter(a => a.id == blocko[w])[0].id +
              ']'
          )
            .parent()
            .css(
              'left',
              blocks.filter(a => a.id == blocko[w])[0].x -
                blocks.filter(a => a.id == blocko[w])[0].width / 2 -
                offsetLeft +
                20
            );
          if (blocks.filter(a => a.id == blocko[w])[0].parent != -1) {
            const arrowHelp = blocks.filter(a => a.id == blocko[w])[0];
            const arrowX =
              arrowHelp.x -
              blocks.filter(
                a => a.id == blocks.filter(a => a.id == blocko[w])[0].parent
              )[0].x;
            if (arrowX < 0) {
              $('.arrowid[value=' + blocko[w] + ']')
                .parent()
                .css('left', arrowHelp.x - offsetLeft + 20 - 5 + 'px');
            } else {
              $('.arrowid[value=' + blocko[w] + ']')
                .parent()
                .css(
                  'left',
                  blocks.filter(
                    id =>
                      id.id == blocks.filter(a => a.id == blocko[w])[0].parent
                  )[0].x -
                    20 -
                    offsetLeft +
                    20 +
                    'px'
                );
            }
          }
        }
        for (let w = 0; w < blocks.length; w++) {
          blocks[w].x =
            $('.blockid[value=' + blocks[w].id + ']')
              .parent()
              .offset().left +
            canvas_div.offset().left -
            $('.blockid[value=' + blocks[w].id + ']')
              .parent()
              .innerWidth() /
              2 -
            40;
        }
        offsetLeftOld = offsetLeft;
      }
    }

    function fixOffset() {
      if (offsetLeftOld < canvas_div.offset().left) {
        lastEvent = false;
        const blockIds = blocks.map(a => a.id);

        for (let i = 0; i < blocks.length; i++) {
          const block = blocks.filter(a => a.id == blockIds[i])[0];

          $('.blockid[value=' + block.id + ']')
            .parent()
            .css('left', block.x - block.width / 2 - offsetLeftOld - 20);
          block.x =
            $('.blockid[value=' + block.id + ']')
              .parent()
              .offset().left +
            block.width / 2;

          if (block.parent != -1) {
            const arrowHelp = block;
            const arrowX =
              arrowHelp.x - blocks.filter(a => a.id == block.parent)[0].x;
            const arrowEl = $('.arrowid[value=' + blockIds[i] + ']');

            if (arrowX < 0) {
              arrowEl
                .parent()
                .css('left', arrowHelp.x - 5 - canvas_div.offset().left + 'px');
            } else {
              arrowEl
                .parent()
                .css(
                  'left',
                  blocks.filter(id => id.id == block.parent)[0].x -
                    20 -
                    canvas_div.offset().left +
                    'px'
                );
            }
          }
        }
        offsetLeftOld = 0;
      }
    }

    function rearrangeMe() {
      const result = blocks.map(a => a.parent);
      for (let z = 0; z < result.length; z++) {
        if (result[z] == -1) {
          z++;
        }
        let totalWidth = 0;
        let totalRemove = 0;
        // let maxheight = 0;
        for (
          let w = 0;
          w < blocks.filter(id => id.parent == result[z]).length;
          w++
        ) {
          const children = blocks.filter(id => id.parent == result[z])[w];
          if (blocks.filter(id => id.parent == children.id).length == 0) {
            children.childwidth = 0;
          }
          if (children.childwidth > children.width) {
            if (w == blocks.filter(id => id.parent == result[z]).length - 1) {
              totalWidth += children.childwidth;
            } else {
              totalWidth += children.childwidth + paddingX;
            }
          } else {
            if (w == blocks.filter(id => id.parent == result[z]).length - 1) {
              totalWidth += children.width;
            } else {
              totalWidth += children.width + paddingX;
            }
          }
        }
        if (result[z] != -1) {
          blocks.filter(a => a.id == result[z])[0].childwidth = totalWidth;
        }
        for (
          let w = 0;
          w < blocks.filter(id => id.parent == result[z]).length;
          w++
        ) {
          const children = blocks.filter(id => id.parent == result[z])[w];
          $('.blockid[value=' + children.id + ']')
            .parent()
            .css(
              'top',
              blocks.filter(id => id.id == result[z]).y + paddingY + 'px'
            );
          blocks.filter(id => id.id == result[z]).y =
            blocks.filter(id => id.id == result[z]).y + paddingY;
          if (children.childwidth > children.width) {
            $('.blockid[value=' + children.id + ']')
              .parent()
              .css(
                'left',
                blocks.filter(id => id.id == result[z])[0].x -
                  totalWidth / 2 +
                  totalRemove +
                  children.childwidth / 2 -
                  children.width / 2 -
                  canvas_div.offset().left +
                  'px'
              );
            children.x =
              blocks.filter(id => id.id == result[z])[0].x -
              totalWidth / 2 +
              totalRemove +
              children.childwidth / 2;
            totalRemove += children.childwidth + paddingX;
          } else {
            $('.blockid[value=' + children.id + ']')
              .parent()
              .css(
                'left',
                blocks.filter(id => id.id == result[z])[0].x -
                  totalWidth / 2 +
                  totalRemove -
                  canvas_div.offset().left +
                  'px'
              );
            children.x =
              blocks.filter(id => id.id == result[z])[0].x -
              totalWidth / 2 +
              totalRemove +
              children.width / 2;
            totalRemove += children.width + paddingX;
          }
          const arrowHelp = blocks.filter(a => a.id == children.id)[0];
          const arrowX =
            arrowHelp.x - blocks.filter(a => a.id == children.parent)[0].x + 20;
          const arrowy =
            arrowHelp.y -
            arrowHelp.height / 2 -
            (blocks.filter(a => a.id == children.parent)[0].y +
              blocks.filter(a => a.id == children.parent)[0].height / 2);
          $('.arrowid[value=' + children.id + ']')
            .parent()
            .css(
              'top',
              blocks.filter(id => id.id == children.parent)[0].y +
                blocks.filter(id => id.id == children.parent)[0].height / 2 -
                canvas_div.offset().top +
                'px'
            );
          if (arrowX < 0) {
            $('.arrowid[value=' + children.id + ']')
              .parent()
              .css('left', arrowHelp.x - 5 - canvas_div.offset().left + 'px');
            $('.arrowid[value=' + children.id + ']')
              .parent()
              .html(
                '<input type="hidden" class="arrowid" value="' +
                  children.id +
                  '"><svg preserveaspectratio="none" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M' +
                  (blocks.filter(id => id.id == children.parent)[0].x -
                    arrowHelp.x +
                    5) +
                  ' 0L' +
                  (blocks.filter(id => id.id == children.parent)[0].x -
                    arrowHelp.x +
                    5) +
                  ' ' +
                  paddingY / 2 +
                  'L5 ' +
                  paddingY / 2 +
                  'L5 ' +
                  arrowy +
                  '" stroke="#C5CCD0" stroke-width="2px"/><path d="M0 ' +
                  (arrowy - 5) +
                  'H10L5 ' +
                  arrowy +
                  'L0 ' +
                  (arrowy - 5) +
                  'Z" fill="#C5CCD0"/></svg>'
              );
          } else {
            $('.arrowid[value=' + children.id + ']')
              .parent()
              .css(
                'left',
                blocks.filter(id => id.id == children.parent)[0].x -
                  20 -
                  canvas_div.offset().left +
                  'px'
              );
            $('.arrowid[value=' + children.id + ']')
              .parent()
              .html(
                '<input type="hidden" class="arrowid" value="' +
                  children.id +
                  '"><svg preserveaspectratio="none" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 0L20 ' +
                  paddingY / 2 +
                  'L' +
                  arrowX +
                  ' ' +
                  paddingY / 2 +
                  'L' +
                  arrowX +
                  ' ' +
                  arrowy +
                  '" stroke="#C5CCD0" stroke-width="2px"/><path d="M' +
                  (arrowX - 5) +
                  ' ' +
                  (arrowy - 5) +
                  'H' +
                  (arrowX + 5) +
                  'L' +
                  arrowX +
                  ' ' +
                  arrowy +
                  'L' +
                  (arrowX - 5) +
                  ' ' +
                  (arrowy - 5) +
                  'Z" fill="#C5CCD0"/></svg>'
              );
          }
        }
      }
    }
  });

  function blockGrabbed(block) {
    grab(block);
  }

  function blockReleased() {
    release();
  }

  function blockSnap(drag) {
    snapping(drag);
  }
};

export default flowy;
