/*
  This file is part of 3D Flip book.

  Copyright (c) 2024 3D Flip book.

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

function init(container) {
  var instance;
  if(window.jQuery) {
    var $ = window.jQuery;
    instance = {
      floatWnd: container.find('.float-wnd'),
      binds: {
        showDropMenu: function(e) {
          e.preventDefault();
          var el = $(e.target);
          while(!el.hasClass('toggle')) {
            el = $(el[0].parentNode);
          }
          var menu = el.find('.menu');
          if(menu.hasClass('hidden')) {
            container.find('.ctrl .fnavbar .menu').addClass('hidden');
            menu.removeClass('hidden');
            e.stopPropagation();
          }
        },
        hideDropMenu: function() {
          container.find('.ctrl .fnavbar .menu').addClass('hidden');
        },
        pickFloatWnd: function(e) {
          if(instance.pos) {
            instance.binds.dropFloatWnd();
          }
          else {
            instance.pos = {
              x: e.pageX,
              y: e.pageY
            };
          }
        },
        moveFloatWnd: function(e) {
          if(instance.pos) {
            var dv = {
              x: e.pageX-instance.pos.x,
              y: e.pageY-instance.pos.y
            }, old = {
              x: parseInt(instance.floatWnd.css('left')),
              y: parseInt(instance.floatWnd.css('top'))
            };
            instance.floatWnd.css('left', old.x+dv.x+'px').css('top', old.y+dv.y+'px');
            instance.pos = {
              x: e.pageX,
              y: e.pageY
            };
          }
        },
        dropFloatWnd: function() {
          delete instance.pos;
        },
        jsCenter: function() {
          var ns = container.find('.js-center');
          for(var i=0; i<ns.length; ++i) {
            var n = $(ns[i]), parentWidth = $(ns[i].parentNode).width(), width = n.width();
            n.css('left', 0.5*(parentWidth-width)+'px');
          }
        }
      },
      appLoaded: function() {
        instance.binds.jsCenter();
      },
      linkLoaded: function(link) {
        instance.binds.jsCenter();
      },
      dispose: function() {
        container.find('.ctrl .fnavbar .fnav .toggle').off('click', instance.binds.showDropMenu);
        $(container[0].ownerDocument).off('click', instance.binds.hideDropMenu);

        $(container[0].ownerDocument).off('mousemove', instance.binds.moveFloatWnd);
        $(container[0].ownerDocument).off('mouseup', instance.binds.dropFloatWnd);
        instance.floatWnd.find('.header').off('mousedown', instance.binds.pickFloatWnd);

        $(container[0].ownerDocument.defaultView).off('resize', instance.binds.jsCenter);
      }
    };
    container.find('.ctrl .fnavbar .fnav .toggle').on('click', instance.binds.showDropMenu);
    $(container[0].ownerDocument).on('click', instance.binds.hideDropMenu);

    $(container[0].ownerDocument).on('mousemove', instance.binds.moveFloatWnd);
    $(container[0].ownerDocument).on('mouseup', instance.binds.dropFloatWnd);
    instance.floatWnd.find('.header').on('mousedown', instance.binds.pickFloatWnd);

    $(container[0].ownerDocument.defaultView).on('resize', instance.binds.jsCenter);
    instance.binds.jsCenter();
  }
  else {
    instance = {
      dispose: function() {
      }
    };
    console.error('jQuery is not found');
  }
  return instance;
} init
