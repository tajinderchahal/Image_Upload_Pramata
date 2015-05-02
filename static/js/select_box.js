/* Select Search Box searching */
/*
 * Function used for narrow down filter data from search box in select dropdown
 */
function select_dropdown_search_events() {
  // search event
  $('body').on('keyup', '.select_box .search_text_box input', function() {
    var search_str = $(this).val();
    if(search_str) {
      if($(this).parents('.select_dropdown').find('.option_text[data-text*="'+ search_str +'"]').length) {
        $(this).parents('.select_dropdown').find('.option_text.no_data').hide();
        $(this).parents('.select_dropdown').find('.option_text').hide();
        $(this).parents('.select_dropdown').find('.option_text[data-text*="'+ search_str +'"]').show();
      } else {
        $(this).parents('.select_dropdown').find('.option_text').hide();
        if(!$(this).parents('.select_dropdown').find('.option_text.no_data').length) {
          $(this).parents('.select_dropdown').find('.select_options').append('<div class="option_text no_data">No data found !</div>');
        } else {
          $(this).parents('.select_dropdown').find('.option_text.no_data').show();
        }
      }
    } else {
      $(this).parents('.select_dropdown').find('.option_text').show();
      $(this).parents('.select_dropdown').find('.option_text.no_data').hide();
    }
  });
  // select event
  $('body').on('click', '.select_box', function(e) {
    if($(e.target).parent().hasClass('search_text_box')) {
      return false;
    }
    $('.select_box .select_dropdown').hide();
    if($(this).hasClass('expanded')) {
      $(this).removeClass('expanded');
      $(this).find('.select_dropdown').hide();
    } else {
      $(this).addClass('expanded');
      $(this).find('.select_dropdown').show();
    }
  });
}

/*
 * Function for attaching click event on select box option
 */
function select_box_selection_event(parent_cls, callback_fn) {
  $('.select_box' + parent_cls).on('click', '.option_text:not(.no_data)', function() {
    var data = $(this).data();
    $(this).parents('.select_box').find('.selected_text').text(data.text);
    $(this).parents('.select_box').find('.selected_text').data('value', data.value);
    data.parent_elem = $(this).parents('.select_box');
    try {
      callback_fn(data);
    } catch(err) {
      console.log('Callback function not provided', err);
    }
  });
}

/*
 * Function to create Select Dropdown  
 */
function create_select_box(parent_cls, data, search_box_required) {
  var html_str = '';
  if(!search_box_required) {
    html_str += '<div class="search_text_box">' +
      '<input class="form-control" type="text" placeholder="Type here to search ...">' +
    '</div>' +
    '<div class="select_options">';
  }
  $.each(data, function(i, v) {
    html_str += '<div class="option_text" data-text="'+ v.text +'" data-value="'+ v.value +'">' + v.text + '</div>';
  });
  html_str += '</div>';
  $('.' + parent_cls + '.select_box .select_dropdown').html(html_str);
}

function get_search_dict() {
  var search_dict = {}
  $('.select_box .selected_text').each(function() {
    if($(this).data('key')) {
      search_dict[$(this).data('key')] = $(this).data('value');
    }
  });
  return search_dict;
}

$(document).ready(function() {
  select_dropdown_search_events();
});
