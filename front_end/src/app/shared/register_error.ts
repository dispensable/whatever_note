/**
 * Created by dispensable on 2016/10/10.
 */
export class RegisterError {
  constructor(
    public username_error: string,
    public email_error: string,
    public password_error: string,
    public repeat_error: string,
  ){}
}
