const MAX_NAME_LENGTH = 20;
const VALID_CATEGORY_IDS = [10, 11, 12];

const defaultValues = 
{
	name: "Toyota Highlander",
	typeId: "10",
};

function initPage() 
{
	document.getElementById("name").value = defaultValues.name;

	const type = document.getElementById("type");
	const count = type.length;
	for (let index = 0; index < count; index++) 
	{
		if (type[index].value === defaultValues.typeId) 
		{
			type.selectedIndex = index;
			break;
		}
	}
}

function onSave() 
{	
	let errorMessage = "";
	const errorMessagePointer = Module._malloc(256);

	const name = document.getElementById("name").value;
	const typeId = getSelectedTypeId();

	if (!validateName(name, errorMessagePointer) || !validateType(typeId, errorMessagePointer)) 
	{
		errorMessage = Module.UTF8ToString(errorMessagePointer);
	}

	Module._free(errorMessagePointer);

	setErrorMessage(errorMessage);
	if ("" === errorMessage) 
	{
		// everything seems to be OK - pass data further to the server
		// ...
	}
	
	const result = Module.ccall('sqrt_int', // name of C function
		'number', 							// return type
		['number'], 						// argument type
		[typeId]); 							// argument
	console.log(result);
}

function setErrorMessage(error) 
{
	const errorMessage = document.getElementById("errorMessage");
	errorMessage.innerText = error; 
	errorMessage.style.display = ( "" === error ? "none" : "" );
}

function validateName(name, errorMessagePointer) 
{
	const isValid = Module.ccall('ValidateName', 			// name of C function
		'number',                                           // return type
		['string', 'number', 'number'],                     // argument type
		[name, MAX_NAME_LENGTH, errorMessagePointer]);      // argument
	return (1 === isValid);
}

function validateType(typeId, errorMessagePointer) 
{
	const arrayLength = VALID_CATEGORY_IDS.length;
	const bytesPerElement = Module.HEAP32.BYTES_PER_ELEMENT;
	const arrayPointer = Module._malloc((arrayLength * bytesPerElement));
	Module.HEAP32.set(VALID_CATEGORY_IDS, (arrayPointer / bytesPerElement));

	const isValid = Module.ccall('ValidateType', 						// name of C function
			'number',                                                   // return type
			['string', 'number', 'number', 'number'],                   // argument type
			[typeId, arrayPointer, arrayLength, errorMessagePointer]);  // argument

	Module._free(arrayPointer);

	return (1 === isValid);
}

function getSelectedTypeId() 
{
	const type = document.getElementById("type");
	const index = type.selectedIndex;
	if (-1 !== index) { return type[index].value; }

	return "0";
}
