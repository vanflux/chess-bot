export {}

declare global {
  module "*.module.css";

  var wrappedJSObject: Window & {
    Config: any,
  };
  function exportFunction(func: (...any)=>any, ctx: any) : (...any)=>any;
  function cloneInto(obj: any, ctx: any, opts?: any) : any;
}