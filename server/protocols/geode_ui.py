import vtk

from wslink import register as exportRpc

from geode_protocols import OpenGeodeProtocol

class OpenGeodeUI(OpenGeodeProtocol):
    @exportRpc("opengeode.ui.background")
    def setBackground(self, viewId, r, g, b):
        self.getSharedObject("renderer").SetBackground(r,g,b)
        view = self.getView(viewId)
        view.Render()
        self.getApplication().InvokeEvent('UpdateEvent')

    @exportRpc("opengeode.ui.test")
    def test(self):
        axes = vtk.vtkAxesActor()
        widget = vtk.vtkOrientationMarkerWidget()
        widget.SetOrientationMarker(axes)
        # widget.SetOrientationMarker(self.north())
        widget.SetInteractor(self.getSharedObject("test"))
        widget.SetViewport( 0.1, 0.1, 0.9, 0.9 )
        # widget.SetOutlineColor( 0.9300, 0.5700, 0.1300 )
        # widget->SetOutlineColor(colors->GetColor3d("Wheat").GetRed(),
        #                         colors->GetColor3d("Wheat").GetGreen(),
        #                         colors->GetColor3d("Wheat").GetBlue());
        widget.EnabledOn()
        widget.InteractiveOn()
        print("widget")


    @exportRpc("opengeode.actor.visibility")
    def updateVisibility(self, id, visibility):
        actor = self.getObject(id)["actor"]
        if type(actor) is dict:
            for components in actor.values():
                for object_actor in components.values():
                    object_actor.SetVisibility(visibility)
        else:
            actor.SetVisibility(visibility)
        self.render()

    @exportRpc("opengeode.camera.reset")
    def resetCamera(self, viewId):
        """
        RPC callback to reset camera.
        """
        view = self.getView(viewId)
        view.GetRenderers().GetFirstRenderer().ResetCamera()
        self.render()

        return str(self.getGlobalId(view))

    @exportRpc("opengeode.reset")
    def reset(self):
        self.getDataBase().clear()
        self.getRenderer().RemoveAllViewProps()

protocols = [OpenGeodeUI]