export default function Form(parametres) {
    const { index, name, accessLevel, description, image } = parametres;
    return (`
        <div class="form-container container-${index}">
            <form class="add-user add-user-${index}" action="/#" method="post" onsubmit="alert('submit!');return false">
                <h3>U: ${name.charAt(0).toUpperCase() + name.substr(1)}</h3>
                <h4>You can change data about yourself</h4>
                <fieldset>
                    <input name="name" id="name-${index}" placeholder="Change your name..." type="text" tabindex="1"
                    autofocus>
                </fieldset>
                <fieldset>
                    <div class="select">
                        <select name="accessLevel" id="accessLevel-${index}" tabindex="2">
                            <option disabled>Choose an option</option>
                            <option value="1" ${ accessLevel == 1 ? 'selected style = \"background: rgba(0, 0, 0, .1)\"' : ``}>Level #1</option>
                            <option value="2" ${ accessLevel == 2 ? 'selected style = \"background: rgba(0, 0, 0, .1)\"' : ``}>Level #2</option>
                            <option value="3" ${ accessLevel == 3 ? 'selected style = \"background: rgba(0, 0, 0, .1)\"' : ``}>Level #3</option>
                        </select>
                    </div>
                </fieldset>
                <fieldset id='image-placer-${index}' onselectstart="return false" onmousedown="return false">${image}</fieldset>
                <fieldset>
                    <textarea name="description" id="description-${index}" placeholder="Type about yourself(optional)...." tabindex="3">${description}</textarea>
                </fieldset>
                <fieldset class="bottom-buttons">
                    <div class="add-user-submit add-user-submit-${index}" onselectstart="return false" onmousedown="return false">Change information</div>
                    <div class="delete-button delete-button-${index}" onselectstart="return false" onmousedown="return false">Delete</div>
                </fieldset>
            </form>
        </div>
    `);
};

