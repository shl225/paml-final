import importlib.machinery, importlib.util, sys, os
pyc_path = os.path.splitext(__file__)[0] + '.pyc'
loader = importlib.machinery.SourcelessFileLoader(__name__, pyc_path)
spec   = importlib.util.spec_from_loader(__name__, loader)
module = importlib.util.module_from_spec(spec)
loader.exec_module(module)
sys.modules[__name__] = module