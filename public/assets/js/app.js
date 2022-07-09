const BASE_DOMAIN = window.location.hostname === "localhost" ? `http://${window.location.host}` : `https://${window.location.host}`;
const CURRENT_DOMAIN = `${BASE_DOMAIN}${window.location.pathname}`;
const COOKIE_DOMAIN = window.location.hostname;
console.log(`BASE_DOMAIN: ${BASE_DOMAIN}\nCOOKIE_DOMAIN: ${COOKIE_DOMAIN}`);

$(window).on("load", function() {
    $("#status").fadeOut();
    $("#preloader").delay(350).fadeOut("slow");
});

function initDates(dateQuery, timeAgoQuery) {
    if (dateQuery) {
        $(dateQuery).toArray().forEach((element) => {
            const date = new Date(Date.parse(element.innerText));
            if (isValidDate(date))
                element.innerText = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            else
                element.innerText = "Never";
        });
    }

    if (timeAgoQuery) {
        $(timeAgoQuery).toArray().forEach((element) => {
            const currentDate = new Date();
            const date = new Date(Date.parse(element.innerText));
            if (isValidDate(date)) {
                const millisecondDifference = currentDate.getTime() - date.getTime();
                const secondDifference = Math.round(millisecondDifference / 1000);
                const minutesDifference = Math.round(secondDifference / 60);
                const hoursDifference = Math.round(minutesDifference / 60);
                const daysDifference = Math.round(hoursDifference / 24);
                const monthsDifference = Math.round(daysDifference / 31);

                if (secondDifference < 10)
                    element.innerText = "A few moments ago";
                else if (secondDifference < 60)
                    element.innerText = `${secondDifference} seconds ago`;
                else if (minutesDifference < 60)
                    element.innerText = `${minutesDifference} minutes ago`;
                else if (hoursDifference < 24)
                    element.innerText = `${hoursDifference} hours ago`;
                else if (daysDifference < 31)
                    element.innerText = `${daysDifference} days ago`;
                else if(monthsDifference > 0)
                    element.innerText = `${monthsDifference} months ago`;
                return;
            }

            element.innerText = "Never";
        });
    }
}

function initDatatables(query = ".datatable-init") {
    $(query).toArray().forEach((element) => {
        DataTable(element, {
            responsive: { details: true },
            destroy: true
        });
    });
}

function initSelect2(query = ".form-select") {
    $(query).toArray().forEach((element) => {
        let options = {};

        if ($(element).hasClass("no-search"))
            options = { ...options, minimumResultsForSearch: Infinity };

        $(element).select2(options);
    });
}

function initDropzone(query, options) {
    $(query).toArray().forEach((element) => {
        $(element).dropzone(options);
    });
}

function copyToClipboard(text) {
    const $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
}

function initClickable(query = ".card-clickable") {
    $(query).click(function() {
        if ($(this).attr("data-href") != null)
            location.href = $(this).attr("data-href");
    });
}

$(document).ready(function() {
    $(".nav-tabs a").click(function() {
        $(this).tab("show");
    });

    $(".password-switch").click(function() {
        const element = $(`#${$(this).attr("data-target")}`);
        $(this).parent().find(".icon-show").toggle();
        $(this).parent().find(".icon-hide").toggle();
        if (element.attr("type") === "password")
            element.attr("type", "text");
        else
            element.attr("type", "password");
    });

    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerElement) {
        return new bootstrap.Popover(popoverTriggerElement);
    });

    initDates(".date", ".time-ago");
    initClickable();
    initDatatables();
    initSelect2();
    InitQuill();

    let $dropdown, $dropdownToggle;
    $(".dropdown-toggle").click(function() {
        $newDropdown = $(this).parent().find(".dropdown-menu");
        $newDropdownToggle = $(this);

        // New dropdown selected
        if ($dropdown != null && $newDropdown.attr("id") != $dropdown.attr("id")) {
            $dropdown.slideUp("fast");
            $dropdownToggle.removeClass("no-react");
        }

        $dropdown = $newDropdown;
        $dropdownToggle = $newDropdownToggle;

        // Toggle down
        if (!$dropdownToggle.hasClass("no-react")) {
            $dropdown.slideDown("fast");
            $dropdownToggle.addClass("no-react");
        }

        // Toggle up
        else {
            $dropdown.slideUp("fast");
            $dropdownToggle.removeClass("no-react");
        }
    });

    $(document).mouseup(function(e) {
        if ($dropdown && !$dropdown.is(e.target) && !$dropdownToggle.is(e.target) && !$dropdown.has(e.target).length && !$dropdownToggle.has(e.target).length) {
            $dropdown.slideUp("fast");
            $dropdownToggle.removeClass("no-react");
        }
    });

    $("[data-target='sideNav']").click(function() {
        if ($("#sideNav").css("display") === "none")
            $("#sideNav").slideDown("fast");
        else
            $("#sideNav").slideUp("fast");
    });

    $(".copy").click(function(event) {
        event.preventDefault();
        const target = $(`#${$(this).attr("data-target")}`);
        if (target)
            copyToClipboard(target.attr("data-copy"));
    });

    $(".dark-switch").click(function() {
        $(this).toggleClass("active");
        $("#dashlite-style").attr("href", `/public/assets/css/${$(this).hasClass("active") ? "dashlite-dark" : "dashlite"}.css`);
        document.cookie = `theme=${$(this).hasClass("active") ? "dark" : "light"}; path=/; domain=${COOKIE_DOMAIN}; secure=true; max-age=31536000;`;
    });
});

function Toast(msg, type, opt = null) {
    var type = type ? type : 'info', msi = '',
        ticon = type === 'info' ? 'ni ni-info-fill' : (type === 'success' ? 'ni ni-check-circle-fill' : (type === 'error' ? 'ni ni-cross-circle-fill' : (type === 'warning' ? 'ni ni-alert-fill' : ''))), 
        def = { position: 'top-right', ui: '', icon: 'auto', clear: false }, attr = opt ? extend(def, opt) : def;

        attr.position = attr.position ? 'toast-' + attr.position : 'toast-top-right';
        attr.icon = attr.icon === 'auto' ? ticon : (attr.icon ? attr.icon : '' );
        attr.ui = attr.ui ? ' ' + attr.ui : '';

        msi  = attr.icon !== '' ? '<span class="toastr-icon"><em class="icon ' + attr.icon + '"></em></span>' : '',
        msg = msg !== '' ? msi + '<div class="toastr-text">' + msg + '</div>' : '';

    if (!msg)
        return;

    if (attr.clear)
        toastr.clear();

    const option = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": attr.position + attr.ui,
        "preventDuplicates": false,
        "showDuration": 1000,
        "hideDuration": 3000,
        "timeOut": 5000,
        "toastClass": "toastr",
        "extendedTimeOut": 3000
    };

    toastr.options = extend(option, attr);
    toastr[type](msg);
    $(".toastr").addClass("bg-dark-accent");
}

function ToastSuccess(message) {
    Toast(message, "success");
}

function ToastInfo(message) {
    Toast(message, "info");
}

function ToastWarn(message) {
    Toast(message, "warning");
}

function ToastError(error) {
    console.error(error);
    let message = "";
    if (error.response && error.response.data && error.response.data.error)
        message = error.response.data.error;
    else if (error.message)
        message = error.message;
    else
        message = error;
    Toast(message, "error");
}

function DataTable(elm, opt) {
    if ($(elm).length) {
        var auto_responsive = $(this).data('auto-responsive');
        var dom_normal = '<"row justify-between g-2"<"col-2 text-left"f><"col-10 text-right"<"datatable-filter"<"d-flex justify-content-end g-2"l>>>><"datatable-wrap my-3"t><"row align-items-center"<"col-5 col-sm-12 col-md-3 text-left text-md-right"i><"col-7 col-sm-12 col-md-9"p>>'; 
        var dom_separate = '<"row justify-between g-2"<"col-2 text-left"f><"col-10 text-right"<"datatable-filter"<"d-flex justify-content-end g-2"l>>>><"my-3"t><"row align-items-center"<"col-5 col-sm-12 col-md-3 text-left text-md-right"i><"col-7 col-sm-12 col-md-9"p>>'; 
        var dom = $(this).hasClass('is-separate') ? dom_separate : dom_normal;
        var def = {
            responsive: true,
            autoWidth: false,
            dom,
            language: {
                search : "",
                searchPlaceholder: "Type to Search",
                lengthMenu: "<div class='form-control-select d-none d-sm-inline-block'>Show _MENU_ records</div>",
                info: "Showing _START_ - _END_ of _TOTAL_",
                infoEmpty: "No records found",
                infoFiltered: "( Total _MAX_ )",
                paginate: {
                    "first": "First",
                    "last": "Last",
                    "next": "Next",
                    "previous": "Prev"
                }
            }
        },
        attr = opt ? extend(def, opt) : def;
        attr = !auto_responsive ? extend(attr, { responsive: false }) : attr;

        $(elm).DataTable(attr);
    }
}

var quillBasicEditor, quillMinimalEditor;
function InitQuill() {
    if ($(".quill-basic").length) {
        const toolbar = [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],

            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],

            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [ 'link', 'image', 'video' ],

            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],

            ['clean']
        ];

        $(".ql-toolbar").first().hide();
        quillBasicEditor = new Quill(".quill-basic", {
            modules: {
                toolbar
            },
            placeholder: "Enter text...",
            theme: 'snow'
        });
    }

    if ($(".quill-minimal").length) {
        const toolbar = [
            ['bold', 'italic', 'underline'],

            [ 'blockquote' ,{ 'list': 'bullet' }],

            [{ 'header': [ 1, 2, 3, 4, 5, 6, false] }],
            [ 'link', 'image', 'video' ],

            [{ 'align': [] }],

            ['clean']
        ];

        $(".ql-toolbar").first().hide();
        quillMinimalEditor = new Quill(".quill-minimal", {
            modules: {
                toolbar
            },
            placeholder: "Enter text...",
            theme: 'snow'
        });
    }
}

function isValidDate(date) {
    return date instanceof Date && !isNaN(date);
}

function extend(obj, ext) {
    Object.keys(ext).forEach((key) => obj[key] = ext[key]);
    return obj;
}