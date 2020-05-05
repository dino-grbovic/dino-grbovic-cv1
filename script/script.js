

function getElements(selector) {
    return document.querySelectorAll(selector);
}
function getDynamicLabelElements() {
    var dynamicLabelElementSelector = '[data-label]';
    var dynamicLabelElements = getElements(dynamicLabelElementSelector);
    return dynamicLabelElements;
}
function getDynamicValueElements() {
    var dynamicValueElementSelector = '[data-value]';
    var dynamicValueElements = getElements(dynamicValueElementSelector);
    return dynamicValueElements;
}
function getDynamiClassElements() {
    var dynamicClassElementSelector = '[data-class]';
    var dynamicClassElements = getElements(dynamicClassElementSelector);
    return dynamicClassElements;
}
function insertValueIntoElement(element, value) {
    if (element && value) {
        element.innerHTML = value;
    }
}
function checkExistingClass(element, className) {
    if (!element) return;

    return element.classList ?
        element.classList.contains(className) :
        new RegExp('\\b' + className + '\\b').test(element.className);
}
function addClassToElement(element, classes) {
    if (element && classes) {
        var singleClassesArray = classes.split(' ');

        for (var i = 0; i < singleClassesArray.length; i++) {
            var singleClass = singleClassesArray[i];

            if (singleClass) {
                var existingClass = checkExistingClass(element, singleClass);

                if (!existingClass) {
                    if (element.classList) {
                        element.classList.add(singleClass);
                    } else {
                        element.className += ' ' + singleClass;
                    }
                }
            }
        }
    }
}
function parseData() {
    if (window.dataForCV) {
        window.dataForCV.name = window.dataForCV.firstName + ' ' + window.dataForCV.lastName;
        if (window.dataForCV.address) {
            window.dataForCV.fullAddress =
                window.dataForCV.address.street + ' ' +
                window.dataForCV.address.city + ' ' +
                window.dataForCV.address.country;
        }
        if (window.dataForCV.social) {
            for (var network in window.dataForCV.social) {
                var networkUrl = network + 'URL';
                var networkIcon = networkUrl + 'Icon';
                var networkName = window.dataForCV.social[network].name;
                window.dataForLabels[networkUrl] = networkName;
                window.dataForCV[networkUrl] = window.dataForCV.social[network].url;
                window.dataForCV[networkIcon] = window.dataForCV.social[network].icon;
            }
        }
    }
    return window.dataForCV;
}
function insertValuesToElements(elements, attributeName, dataSource) {
    if (elements && elements.length && attributeName) {
        for (var i = 0; i < elements.length; i++) {
            var currentElement = elements[i];
            var attributeValue = currentElement.getAttribute(attributeName);

            if (currentElement && attributeValue) {
                var valueFromData = dataSource[attributeValue];

                if (attributeName === 'data-class') {
                    addClassToElement(currentElement, valueFromData);
                } else {
                    insertValueIntoElement(currentElement, valueFromData);                    
                }
            }
        }
    }
}
function renderElements(data) {
    function replaceElementValues(elements, attributeName, itemData) {
        for (var iterator = 0; iterator < elements.length; iterator++ ) {
            var currentElement = elements[iterator];
            var currentAttributeValue = currentElement.getAttribute(attributeName);
            var itemDataProperty = currentAttributeValue.split('.');
            itemDataProperty = itemDataProperty[itemDataProperty.length - 1];
            if (itemData && itemData[itemDataProperty]) {
                var valueFromItemData = itemData[itemDataProperty];
                currentElement.innerHTML = valueFromItemData;
                currentElement.removeAttribute(attributeName);
            }
        }
    }
    function replaceElementWidth(elements, attributeName, itemData) {
        for (var iterator = 0; iterator < elements.length; iterator++) {
            var currentElement = elements[iterator];
            var currentAttributeValue = currentElement.getAttribute(attributeName);
            var itemDataPropertyArray = currentAttributeValue.split('.');
            var itemDataProperty = itemDataPropertyArray[itemDataPropertyArray.length - 1];

            if (itemData && itemData[itemDataProperty]) {
                var valueFromItemData = itemData[itemDataProperty];

                currentElement.style.width = valueFromItemData + "%";
                currentElement.removeAttribute(attributeName);
            }
        }
    }
    function replaceAttributeValues(elements, attributeName, attributeValue) {
        for (var iterator = 0; iterator < elements.length; iterator++ ) {
            var currentElement = elements[iterator];

            currentElement.removeAttribute(attributeName);

            if (attributeName === 'data-class') {
                attributeValue += 'Icon';
                this.className = '';
            }

            currentElement.setAttribute(attributeName, attributeValue);
        }
    }
    function incrementalFill(elements, data, timeoutValue) {
        setTimeout(function(){
            replaceElementWidth(elements, 'data-fill', data);
        }, timeoutValue);

    }

    
    function renderSectionElements(sectionId) {
        var elementSelector = window.elementIds[sectionId];
        var element = document.getElementById(elementSelector);
        var sectionProperties = window.sectionProperties[sectionId];

        if (data && sectionProperties) {
            for (var i = 0; i < sectionProperties.length; i++) {
                var currentInfoProperty = sectionProperties[i];
                var checkProperty = currentInfoProperty.checkProperty;
                var attributeValue = currentInfoProperty.attributeValue;

                if (data[checkProperty]) {
                    var cloneElement = element.cloneNode(true);
                    var parentElement = element.parentNode;
                    var dataLabelChildren = cloneElement.querySelectorAll('[data-label]');
                    var dataValueChildren = cloneElement.querySelectorAll('[data-value]');
                    var dataClassChildren = cloneElement.querySelectorAll('[data-class]');

                    cloneElement.removeAttribute('id');

                    replaceAttributeValues(dataLabelChildren, 'data-label', attributeValue);
                    replaceAttributeValues(dataValueChildren, 'data-value', attributeValue);
                    replaceAttributeValues(dataClassChildren, 'data-class', attributeValue);

                    parentElement.appendChild(cloneElement);
                }
            }

            element.parentNode.removeChild(element);
        }
    }
    function renderSectionCollectionElements(sectionId) {
        var elementSelector = window.elementIds[sectionId];
        var element = document.getElementById(elementSelector);
        var sectionProperties = window.sectionProperties[sectionId];

        if (data && sectionProperties && sectionProperties[0]) {
            var checkProperty = sectionProperties[0].checkProperty;
            var sectionItems = data[checkProperty];

            if (sectionItems) {
                // Loop through Section Items (collection of items from main Data)
                for (var i = 0; i < sectionItems.length; i++) {
                    // currentItem variable holds current data from Section Items collection
                    var currentItem = sectionItems[i];
                    var cloneElement = element.cloneNode(true);
                    var parentElement = element.parentNode;
                    var dataLabelChildren = cloneElement.querySelectorAll('[data-label]');
                    var dataValueChildren = cloneElement.querySelectorAll('[data-value]');
                    var dataFillChildren = cloneElement.querySelectorAll('[data-fill]');
                    cloneElement.removeAttribute('id');

                    //replaceElementValues(dataLabelChildren, 'data-label', attributeValue);
                    replaceElementValues(dataValueChildren, 'data-value', currentItem);

                    parentElement.appendChild(cloneElement);
                    incrementalFill(dataFillChildren, currentItem, 300);
                }
                element.parentNode.removeChild(element);
            }
        }
    }

    for (var propertyName in window.elementIds) {
        switch(propertyName) {
            case 'work':
                renderSectionCollectionElements(propertyName)
                break;
            case 'education':
                renderSectionCollectionElements(propertyName)
                break;
            case 'skills':
                renderSectionCollectionElements(propertyName)
                break;
            default:
                renderSectionElements(propertyName);
                break;
        }
    }
}

window.elementIds = {
    info: 'info-item',
    work: 'work-item',
    education: 'education-item',
    skills : 'skills-item'
};
window.sectionProperties = {
    info: [{
        checkProperty: 'phone',
        attributeValue: 'phone'
    },{
        checkProperty: 'email',
        attributeValue: 'email'
    },{
        checkProperty: 'website',
        attributeValue: 'website'
    },{
        checkProperty: 'address',
        attributeValue: 'fullAddress'
    }],
    work: [{
        checkProperty: 'experience',
        attributeValue: 'experience'
    }],
    education: [{
        checkProperty: 'education',
        attributeValue: 'education'
    }],
    skills: [{
        checkProperty: 'skills',
        attributeValue: 'skills'
    }]
};
document.addEventListener('DOMContentLoaded', function() {
    var parsedData = parseData();
    var labelData = window.dataForLabels;

    if (parsedData && labelData) {
        renderElements(parsedData);
        document.getElementById("full-name").innerHTML=dataForCV.name
        document.getElementById("job-name").innerHTML=dataForCV.jobTitle
        insertValuesToElements(getDynamicValueElements(), 'data-value', parsedData);
        insertValuesToElements(getDynamiClassElements(), 'data-class', parsedData);
        insertValuesToElements(getDynamicLabelElements(), 'data-label', window.dataForLabels);
    }



});

