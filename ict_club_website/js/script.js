$(document).ready(function() {
    
    // ==========================================
    // 1. BASIC INTERACTION & SMART LOGIC
    // ==========================================
    
    // Change the navbar background color when the user scrolls
    $(window).scroll(function() {
        if ($(window).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
            // Back to Top button logic
            $('#back-to-top').fadeIn();
        } else {
            $('.navbar').removeClass('scrolled');
            // Back to Top button logic
            $('#back-to-top').fadeOut();
        }
    });

    // Add a badge dynamically to the hero title using jQuery
    $('#hero-title').append('<span class="badge">ICT Member</span>');

    // Hide and show a section using a button
    $('#toggle-activities').click(function() {
        $('#activities-container').fadeToggle(600);
    });

    // Create a "Back to Top" button that appears after scrolling
    $('#back-to-top').click(function() {
        $('html, body').animate({ scrollTop: 0 }, 600);
    });

    // Implement a dark mode toggle using jQuery (Smart Logic)
    $('#dark-mode-toggle').click(function() {
        $('body').toggleClass('dark-mode');
        $(this).find('i').toggleClass('fa-moon fa-sun');
    });

    // Prevent scrolling and show a "lock overlay" after scrolling 300px (Smart Logic)
    let isLocked = false;
    let isUnlockedByUser = false;
    $(window).scroll(function() {
        if ($(window).scrollTop() >= 300 && !isUnlockedByUser && !isLocked) {
            isLocked = true;
            $('#lock-overlay').css('display', 'flex').hide().fadeIn(300);
            $('html, body').css({ 'overflow': 'hidden', 'height': '100%'});
            $(window).scrollTop(300);
        }
    });
    
    $('#unlock-btn').click(function() {
        isUnlockedByUser = true;
        isLocked = false;
        $('#lock-overlay').fadeOut(300);
        $('html, body').css({ 'overflow': 'auto', 'height': 'auto'});
    });


    // ==========================================
    // 2. DOM MANIPULATION
    // ==========================================

    // Dynamically add a new activity card
    $('#add-activity').click(function() {
        let newCard = `
            <div class="card activity-card" style="display:none;">
                <i class="fas fa-magic card-icon"></i>
                <h3>New Workshop</h3>
                <p>Dynamically added via jQuery.</p>
                <button class="btn-small card-btn">Details</button>
            </div>
        `;
        $('#activities-container').append(newCard);
        $('.activity-card').last().fadeIn(800);
        updateCardTrasnversing(); // Re-apply traversing logic on new items
        attachHoverEvents(); // Re-attach hover animations
    });

    // Remove a team member card when clicking delete (except Leader: Hassan Farsi)
    // Using delegation so it works structurally
    $('#team-container').on('click', '.delete-member', function(e) {
        e.stopPropagation(); // Avoid triggering parent's alert event
        let parentCard = $(this).parent();
        
        if (parentCard.attr('id') === 'hassan-farsi') {
            alert("Error: You cannot delete the Club Leader!");
        } else {
            parentCard.fadeOut(400, function() {
                $(this).remove();
            });
        }
    });

    // Change all section titles' colors using one jQuery selector
    $('.section-title').css('color', 'var(--primary)');

    // Append a "New" badge to the first competition card only
    $('.competition-card').first().find('h3').append('<span class="new-badge">New</span>');


    // ==========================================
    // 3. EVENTS
    // ==========================================

    function attachHoverEvents() {
        // Remove old handlers to prevent duplicates if function called multiple times
        $('.card').off('mouseenter mouseleave');
        
        // Add hover animation to all cards (Bounce slightly)
        $('.card').hover(
            function() {
                $(this).animate({ top: '-10px' }, 200).animate({ top: '0px' }, 200);
            }, 
            function() { /* Restore logic naturally via CSS if needed */ }
        );
    }
    attachHoverEvents();

    // Display an alert when a team member card is clicked
    $('#team-container').on('click', '.team-card', function() {
        alert("You clicked on Team Member: " + $(this).find('h3').text());
    });

    // Create a double-click event that enlarges a card
    $('.card').dblclick(function() {
        $(this).css({ 'transform': 'scale(1.05)', 'z-index': '10', 'box-shadow': '0 20px 25px rgba(0,0,0,0.2)' });
        setTimeout(() => {
            $(this).css({ 'transform': 'scale(1)', 'z-index': '1', 'box-shadow': '' });
        }, 1000);
    });

    // Show a tooltip message when hovering over social icons
    $('.social-icons a').hover(
        function(e) {
            let tooltipText = $(this).attr('title');
            if(tooltipText) {
                $(this).data('tipText', tooltipText).removeAttr('title');
                $('<p class="ui-tooltip"></p>')
                    .text(tooltipText)
                    .appendTo('body')
                    .css({ 'top': e.pageY + 15, 'left': e.pageX + 15 })
                    .fadeIn('slow');
            }
        },
        function() {
            $(this).attr('title', $(this).data('tipText'));
            $('.ui-tooltip').remove();
        }
    ).mousemove(function(e) {
        $('.ui-tooltip').css({ 'top': e.pageY + 15, 'left': e.pageX + 15 });
    });

    // Keyboard event that changes background color when pressing a key
    $(document).keydown(function(e) {
        // Only if page is unlocked and valid key to avoid annoying bugs
        if (!isLocked && String.fromCharCode(e.keyCode).match(/[a-zA-Z0-9]/)) {
            let randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
            $('body').css('background-color', randomColor);
        }
    });


    // ==========================================
    // 4. ANIMATIONS & ADVANCED EFFECTS
    // ==========================================

    // Make sections fade in when they enter the viewport
    $(window).scroll(function() {
        let scroll = $(window).scrollTop();
        $('.section').each(function() {
            let sectionTop = $(this).offset().top;
            if (scroll + $(window).height() > sectionTop + 150) {
                $(this).animate({ opacity: 1 }, 1000);
            }
        });

        // Create a progress bar that fills while scrolling
        let docHeight = $(document).height() - $(window).height();
        let scrollPercent = (scroll / docHeight) * 100;
        $('#scroll-progress').css('width', scrollPercent + '%');

        // Implement a parallax scrolling effect
        $('.hero-section').css('background-position', 'center ' + (scroll * 0.4) + 'px');
    });

    // Create a sliding announcement banner
    $('.announcement-banner').slideDown(1500).delay(5000).slideUp(1000); // Slide down on load

    // Animate the hero text on page load
    $('.hero-content').css({ marginTop: '100px', opacity: 0 }).animate({ opacity: 1, marginTop: '0px' }, 1500);

    // Build a typing animation for the hero title
    const typingText = "with Code and Passion.";
    let typeIndex = 0;
    function typeWriter() {
        if (typeIndex < typingText.length) {
            $('.typing-text').append(typingText.charAt(typeIndex));
            typeIndex++;
            setTimeout(typeWriter, 120);
        }
    }
    setTimeout(typeWriter, 1500); // Start after hero fade in

    // Create a modal popup that appears after 10 seconds
    setTimeout(function() {
        $('#welcome-modal').fadeIn(500).css('display', 'flex');
    }, 10000);

    $('#close-modal').click(function() {
        $('#welcome-modal').fadeOut(500);
    });

    // Create a background image slider for the hero section
    const bgImages = [
        'url("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80")',
        'url("https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80")',
        'url("https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80")'
    ];
    let bgIndex = 0;
    setInterval(function() {
        bgIndex = (bgIndex + 1) % bgImages.length;
        $('.hero-section').css({
            'background-image': 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), ' + bgImages[bgIndex],
            'transition': 'background-image 2s ease-in-out'
        });
    }, 5000); // Change image every 5s


    // ==========================================
    // 5. TRAVERSING
    // ==========================================

    function updateCardTrasnversing() {
        // Select only the first and last activity cards and style them differently
        $('.activity-card').removeClass('activity-styled');
        $('.activity-card').first().addClass('activity-styled');
        $('.activity-card').last().addClass('activity-styled');

        // Count how many cards exist and display the number dynamically
        $('#activity-count').text("Total cards on page: " + $('.card').length);
    }
    updateCardTrasnversing();

    // When clicking a team member, highlight it and remove highlight from siblings
    $('#team-container').on('click', '.team-card', function() {
        $(this).addClass('highlight').siblings().removeClass('highlight');
    });

    // Find a specific element inside a card using .find() and modify it
    $('.card').dblclick(function() {
        $(this).find('h3').css('color', 'var(--secondary)');
    });

    // Use .parent() to change the card background when a button inside it is clicked
    $('#activities-container').on('click', '.card-btn', function(e) {
        e.stopPropagation(); 
        let parentBg = $(this).parent();
        parentBg.css('background-color', '#e0f2fe'); // Light blue
        setTimeout(() => {
            parentBg.css('background-color', ''); // Revert
        }, 1500);
    });


    // ==========================================
    // 6. CHAINING PRACTICE
    // ==========================================

    // Use chaining to hide, change color, and fade in an element in one statement
    $('#hero-subtitle')
        .hide()
        .css({ 'color': '#10b981', 'font-weight': 'bold', 'letter-spacing': '2px' })
        .fadeIn(3000);

    // Animate and style a card using only one chained command
    $('.competition-card').last()
        .css({ 'border-top': '5px solid var(--primary)', 'background-color': '#f8fafc' })
        .slideUp(800)
        .slideDown(800)
        .animate({ opacity: 0.8 }, 500)
        .animate({ opacity: 1 }, 500);

    // Select all cards and apply multiple CSS changes using chaining
    $('.card')
        .css({ 'border-radius': '20px', 'transition': 'all 0.4s ease' })
        .delay(200);

});
