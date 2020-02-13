import vtk

from wslink import register as exportRpc

from geode_protocols import OpenGeodeProtocol

class OpenGeodeMouseHandler(OpenGeodeProtocol):
    @exportRpc("opengeode.mouse.menu")
    def mouseInteraction(self, event):
        print(event)
        view = self.getView(event['view'])
        renderer = view.GetRenderers().GetFirstRenderer()
        picker = vtk.vtkPicker()
        ret = picker.Pick(event['x'],event['y'],0,renderer)
        print(picker.GetPickPosition())
        print(picker.GetActors())

protocols = [OpenGeodeMouseHandler]