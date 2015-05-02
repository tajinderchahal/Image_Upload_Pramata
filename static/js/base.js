/*
 * Function for creating filter block
 *
 * @params fd dictionary object e.g. {'value': 1, 'text': '5th', 'group_key': 'ClassSection', 'ftype': 'select', 'title': 'aasda'}
 * @params callback_fn: function need to be called after filter is attached
 */
function apply_filter(fd, callback_fn) { 
  var filter_group = $('.applied_filter_block .inner_filter_block[data-name="'+ fd.group_key +'"]');
  var filter_html_str = '<div class="inner_filter pull-left" data-value="'+ fd.value +'">' + 
      '<span class="text">'+ fd.text +'</span>' +
      '<span class="glyphicon glyphicon-remove remove_filter remove_filter_style"></span>' +
    '</div>';
  if( !filter_group.length ) {
    filter_group = $('<div data-value="" data-name="'+ fd.group_key +'" class="inner_filter_block pull-left">' +
        '<div class="filter_name pull-left"><span>'+ fd.title +':</span></div>' +
        '<div class="filter_data pull-left"></div>' +
      '</div>');
    $('.applied_filter_block').append(filter_group);
  }

  if( fd.ftype == 'select' ) {
    var filter_data = filter_group.data('value');
    if( filter_data.length ) {
      if( $.inArray(fd.value, filter_data) != -1) {
        $('.filter_box').hide();
        alert('Filter Already added');
        return false;
      }
      filter_data.push(fd.value);
    } else {
      filter_data = [fd.value];
    }
    filter_group.data('value', filter_data);
    filter_group.find('.filter_data').append(filter_html_str);
  } else {
    filter_group.data('value', fd.text);
    filter_group.find('.filter_data').html(filter_html_str);
  }
  $('.filter_box').hide();
  $('.filter_block').show();
  try {
    callback_fn();
  } catch(err) {
    console.log('No callback function provided');
  }
}

/*
 * Function for removing filter (needed to be initialised in document.ready of page
 * with callback function
 */
function remove_filter(callback_fn) {
  $('.filter_block').on('click', '.remove_filter', function() {
    if( $(this).parents('.inner_filter_block').find('.inner_filter').length == 1) {
      if( $(this).parents('.applied_filter_block').find('.inner_filter_block').length == 1 ) {
        $(this).parents('.inner_filter_block').data('value', '');
        $('.filter_block .inner_filter_block').remove();
        $('.filter_block').hide();
        try {
          callback_fn();
        } catch(err) {
          console.log('No callback function provided');
        }
        return false;
      } else {
        $(this).parents('.inner_filter_block').remove();
      }
    }
    
    var fid = $(this).parent().data('value');
    var whole_value = $(this).parents('.inner_filter_block').data('value');
    var fid_index = $.inArray(fid, whole_value)
    if(fid_index != -1) {
      whole_value.splice(fid_index, 1);
    }
    $(this).parents('.inner_filter_block').data('value', whole_value);
    $(this).parent().remove();
    try {
      callback_fn();
    } catch(err) {
      console.log('No callback function provided');
    }
  });
}

/*
 * Function to generate applied filter dictionary 
 * required for backend purpose
 */
function generate_filter_dict() {
  var fb = $('.applied_filter_block .inner_filter_block');
  var filter_dict = {};
  if( !fb.length) {
    return {}
  } 
  fb.each(function() {
    filter_dict[$(this).data('name')] = $(this).data('value')
  }); 
  return filter_dict;
}

/*
 * Function to create Filter box in table header
 */
function create_filter_box(type, filter_data, header_cls, title) {
  var html = '';
  if( type == 'select' ) {
    html += '<div class="filter_box" data-group_key="'+ header_cls +'">' +
      '<div class="filter_input_area">' +
        '<input type="text" class="form-control" placeholder="Search here">' +
      '</div>' +
      '<div class="filter_data_area">';
      $.each(filter_data, function(i, v) {
        html += '<div class="filter_select" data-filter_id="'+ header_cls + '_' + 
            v.value +'" data-ftype="select" data-text="'+ v.text +'" data-value="'+ 
          v.value +'" data-group_key="'+ header_cls +'" data-title="'+ title +'">'+ v.text +'</div>';
      });
      html += '</div>' +
    '</div>';
  } else {
    html += '<div class="filter_box" data-group_key="'+ header_cls +'">' +
      '<div class="filter_input_area">' +
        '<input type="text" class="form-control" placeholder="Search here">' +
      '</div>' +
      '<div class="filter_action_btn text-right">' +
        '<button class="apply btn btn-xs btn-success">Apply</button>' +
        '<span> </span>' +
        '<button class="cancel btn btn-xs btn-danger">Cancel</button>' +
      '</div>' + 
    '</div>';
  }
  return html;
}

/*
 * Function used for narrow down filter data from search box in select filter
 */
function filter_option_search() {
  $('body').on('keyup', '.filter_input_area input', function() {
    var search_str = $(this).val();
    if(search_str) {
      if($(this).parents('.filter_box').find('.filter_select[data-text*="'+ search_str +'"]').length) {
        $(this).parents('.filter_box').find('.filter_select.no_data').hide();
        $(this).parents('.filter_box').find('.filter_select').hide();
        $(this).parents('.filter_box').find('.filter_select[data-text*="'+ search_str +'"]').show();
      } else {
        $(this).parents('.filter_box').find('.filter_select').hide();
        if(!$(this).parents('.filter_box').find('.filter_select.no_data').length) {
          $(this).parents('.filter_box').find('.filter_data_area').append('<div class="filter_select no_data">No data found !</div>');
        } else {
          $(this).parents('.filter_box').find('.filter_select.no_data').show();
        }
      } 
    } else {
      $(this).parents('.filter_box').find('.filter_select').show();
      $(this).parents('.filter_box').find('.filter_select.no_data').hide();
    }
  });
}

/*
 * Event called on click the select option in select filter type
 */
function filter_select_option_click(callback_fn) {
  $('body').on('click', '.filter_select', function() {
    var fd = $(this).data();
    apply_filter(fd, callback_fn) 
  });
}

/*
 * Event called on clicking Apply in search box filter type
 */
function filter_search_box_click(callback_fn) {
  $('body').on('click', '.filter_action_btn .apply', function() {
    var fd = {
      'text': $(this).parents('.filter_box').find('input').val(),
      'group_key': $(this).parents('.filter_box').data('group_key')
    }
    apply_filter(fd, callback_fn);
    $(this).parents('.filter_box').hide();
  });

  $('body').on('click', '.filter_action_btn .cancel', function() {
    // remove text from textbox
    $(this).parents('.filter_box').find('input').val('');
    $(this).parents('.filter_box').hide();
  });
}


/*
 * Function to format day in date by adding st,nd,rd,th to it 
 */
function df(date) {
  date = date.toString();
  var date_string_map = {
    '1': 'st',
    '2': 'nd',
    '3': 'rd'
  }
  var last_digit = date.split('').pop();
  var new_date = parseInt(date);
  if(date_string_map[last_digit] && $.inArray(date, ['12', '13', '14']) == -1) {
    new_date = new_date + date_string_map[last_digit];
  } else {
    new_date = new_date + 'th';
  }
  return new_date;
}

/*
 * Function to attach click event on filter icon
 */
function filter_icon_click() {
  $('body').on('click', '.filter_icon', function() {
    $('.filter_box').hide();
    $(this).parents('th').find('.filter_box').toggle();
  });
}

$(document).ready(function() {
  $(document).mousedown(function(e) {
    if(!$(e.target).parents('.filter_box').length) {
      $('.filter_box').hide();
    }
  });  
});

var att_status = {
  'P': {'text': 'Present', 'class': 'label-success'},
  'A': {'text': 'Absent', 'class': 'label-danger'},
  'M': {'text': 'Medical', 'class': 'label-warning'},
  'MS': {'text': 'Medical', 'class': 'label-warning'},
  'O': {'text': 'Other', 'class': 'label-warning'},
}
