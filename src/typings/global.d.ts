export {}

declare global {
  module "*.module.css";

  var wrappedJSObject: Window & {
    Config: any,
    gi: any,
  };
  function exportFunction(func: (...args: any)=>any, ctx: any) : (...args: any)=>any;
  function cloneInto(obj: any, ctx: any, opts?: any) : any;
}
