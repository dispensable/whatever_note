/**
 * Created by dispensable on 2016/10/11.
 */

enum NotificationType {
  success,
  info,
  warning,
  danger
}

/** type: 决定了通知的类型,success, info, waring, danger可选
 *  content: 通知的内容
 *  timer: 通知出现的时间,负值表示不自动消失 单位:ms */
export class Notification {
  constructor(
    public type: NotificationType,
    public content: string,
    // TODO: add operation to support quick reply
    public timer: number
  ) { }
}
