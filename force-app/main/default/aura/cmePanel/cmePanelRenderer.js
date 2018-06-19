({
	afterRender: function(component, helper) {
		this.superAfterRender();
		helper.dragElement(component);
	}
})