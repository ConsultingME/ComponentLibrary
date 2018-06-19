({
	onStepEnabledChanged: function(component, event, helper) {
		var evt = component.getEvent("onCMEWizardStepEnabledChange");
		evt.fire();
	}
})