![Banner](images/logo.png)

# TypeScript Interface to Builder Class

TypeScript Interface to Builder Class is a vscode extension that will save you time by automatically generating a builder class from a TypeScript interface.

## Features

Stop wasting time manually writing out builder classes. Define an interface and use this extention to generate your builder.

![Example](images/example.gif)

The generated file will be saved next to your interface file with `.builder.ts` appended to the end of the original filename.

If you're not already using builders, you should start. They are a great way to easily generate data for your unit tests.

If you are using this extension and find any issues or wish to add improvments, feel free to contribute.

## Example

Here is an example of using the generated builder to create a user for a test scenario.

Start with an interface file that you have written.

**user.interface.ts**
```
export interface IUser {
  firstName: string
  lastName: string
  email: string
  age: number
}
```

Run the extension `Cmd/Ctrl + Shift + P => Generate Builder Class From TypeScript Interface`.

Manually update the generated file to take care of any required imports and set the default values.

Import the generated file into your test class.

To create a new user with the default values defined in the builder class use the following code.

```
const user: IUser = new UserBuilder().build()
```

If you want to override the default values you can specify unique values using `.with<PropertyName>(value)`.

```
const user: IUser = new UserBuilder()
  .withFirstName('Bruce')
  .withLastName('Wayne')
  .withEmail('bruce.wayne@wayne-enterprises.com')
  .WithAge(48)
  .build()
```

## Requirements

To use the extension:
* You must have a folder open in Visual Studio Code
* You must have an interface file open
* Your interface must include the text `export interface`
* You need to have at least one property defined with a datatype e.g. `firstName: string`

## Known Issues

* Any required imports will have to be added manually after the builder is generated.
* If your property has an [Advanced Type](https://www.typescriptlang.org/docs/handbook/advanced-types.html) e.g. `foo: keyof IFoo` the inital value will be `undefined` which will not compile unless the property is optional. These values will need to entered manually.

## Release Notes

Users appreciate release notes as you update your extension.

### 0.1.0

Beta release.
