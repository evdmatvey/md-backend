import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsPasswordsMatching', async: false })
export class IsPasswordsMatchingConstraint
  implements ValidatorConstraintInterface
{
  public validate(passwordRepeat: string, args: ValidationArguments) {
    const obj = args.object as { password: string };
    return obj.password === passwordRepeat;
  }

  public defaultMessage() {
    return 'Пароли не совпадают.';
  }
}

export function IsPasswordsMatching(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsPasswordsMatching',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsPasswordsMatchingConstraint,
    });
  };
}
