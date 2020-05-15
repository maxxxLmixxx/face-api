{ 
    const icons = {
        camera: document.querySelector('.left-menu--top li:nth-child(1)'),
        folder: document.querySelector('.left-menu--top li:nth-child(2)'),
        menu: document.querySelector('.left-menu--top li:nth-child(3)'),
        people: document.querySelector('.left-menu--top li:nth-child(4)'),
        gear: document.querySelector('.left-menu--bottom li:nth-child(1)')
    };


    
    iconDescriptionEvent(icons.people);
    iconOpenWindow(icons.people.querySelector('a'), {
        href: './forms/addUser/addUser.html',
        name: 'Add user',
        width: 455,
        height: 750
    });

    iconDescriptionEvent(icons.menu); // opens by tag: <a></a>
    
    iconDescriptionEvent(icons.gear);
    holdDescriptionEvent(icons.gear);
 
    function holdDescriptionEvent(clickElement) {
        clickElement.addEventListener('click', e => {
            const span = clickElement.querySelector('span');

            if (!span.classList.contains('clicked')) {
                span.classList.add('clicked');
                span.style.cssText = `display: block; pointer-events: none;`;
                icons.gear.style.cssText = `
                background-color: hsla(200, 50%, 42%, 1.0);
                border-left: 5px solid rgb(62, 103, 184);
                `;
            } else {
                span.classList.remove('clicked');
                span.style.cssText = '';
                icons.gear.style.cssText = ``;
            }
        });
    }

    function iconDescriptionEvent(hoverElement) {
        const span = hoverElement.querySelector('span');

        hoverElement.addEventListener('mouseover', e => {
            span.classList.remove('no-display');
        });

        hoverElement.addEventListener('mouseout', e => {
            span.classList.add('no-display');
        });
    }

    function iconOpenWindow(element, o) {
        element.addEventListener('click', e => {
            const opWindow = globalVariables.addUserWindow;

            if (opWindow.length) opWindow.pop().close();

            const newOne = window.open(
                o.href,
                o.name,
                `height=${o.height},
                 width=${o.width},
                 toolbar=false,
                 resizable=false,
                 scrollbars=false`
            );
            opWindow.push(newOne);    

            const storedImage = globalVariables.currentImage; 
            localStorage.setItem('currentImage', storedImage);
        });
    }

}
