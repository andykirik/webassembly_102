#include <cstdlib>
#include <cstring>

// If this is an Emscripten (WebAssembly) build then...
#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

#ifdef __cplusplus
extern "C" { // So that the C++ compiler does not change function names
#endif

int ValidateInputValue(const char* value, const char* default_error_message, char* return_error_message)
{
	if ((value == NULL) || (value[0] == '\0'))
	{
		strcpy(return_error_message, default_error_message);
		return 0;
	}
	return 1;
}

int IsTypeIdInArray(char* selected_type_id, int* valid_type_ids, int array_length)
{
	int type_id = atoi(selected_type_id);
	for (int index = 0; index < array_length; index++)
		if (valid_type_ids[index] == type_id)
			return 1;
	return 0;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int ValidateName(char* name, int maximum_length, char* return_error_message)
{
	// 1: A name must be provided
	if (ValidateInputValue(name, "A Car Name must be provided.", return_error_message) == 0)
		return 0;

	// 2: A name must not exceed the specified length
	if (strlen(name) > maximum_length)
	{
		strcpy(return_error_message, "The Car Name is too long.");
		return 0;
	}

	// Everything is OK
	return 1;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int ValidateType(char* type_id, int* valid_type_ids, int array_length, char* return_error_message)
{
	// 1: A Type ID must be selected
	if (ValidateInputValue(type_id, "A Car Type must be selected.", return_error_message) == 0)
		return 0;

	// 2: A list of valid Type IDs must be passed in
	if ((valid_type_ids == NULL) || (array_length == 0))
	{
		strcpy(return_error_message, "There are no Car Type available.");
		return 0;
	}

	// 3: The selected Type ID must match one of the IDs provided
	if (IsTypeIdInArray(type_id, valid_type_ids, array_length) == 0)
	{
		strcpy(return_error_message, "The selected Car Type is not valid.");
		return 0;
	}

	// Everything is OK
	return 1;
}

int sqrt_int(int x) {
	
	int y = x * x;
	
	EM_ASM(	{ console.log('x = ' + $0); }, x);
	
	return y;
}

#ifdef __cplusplus
}
#endif
