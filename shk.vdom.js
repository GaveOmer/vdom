const vdomExample = {
	tag: 'div',
	props: {
		class: 'container',
	},
	children: [
		{
			tag: 'h1',
			props: {
				title: 'this is a title',
			},
			children: 'Vdom example',
		},
		{
			tag: 'p',
			props: {
				class: 'description',
			},
			children: 'this is a description',
		},
	],
}

// Create a virtual node
function render(tag, props, children) {
	return {
		tag,
		props,
		children,
	}
}
// Mount virtual node to the DOM
function mount(vnode, container) {
	const el = document.createElement(vnode.tag)

	el.innerHTML = vnode.children
	
	for (const key in vnode.props) {
		el.setAttribute(key, vnode.props[key])
	}


		

	container.appendChild(el)

	vnode.$el = el
}

//unmount a vNode from the DOM
function unmount(vnode) {
	vnode.$el.parentNode.removeChild(vnode.$el)
}

//takes 2 nodes, compares them to each other and figures out the difference
function patch(n1, n2) {
	//different tags
	if (n1.tag !== n2.tag) {
		mount(n2, n1.$el.parentNode)
		unmount(n1)
	} else {
		//different props
		n2.$el = n1.$el

		if (typeof n2.children === 'string') {
			n2.$el.textContent = n2.children
		} else {
			while (n2.$el.attributes.length > 0) {
				n2.$el.removeAttribute(n2.$el.attributes[0].name)

				for (const key in n2.props) {
					n2.$el.setAttribute(key, n2.props[key])
				}
			}
			if (typeof n1.children === 'string') {
				n2.$el.textContent = null
				n2.children.forEach((child) => mount(child, n2.$el))
			} else {
				const commonLength = Math.min(n1.children.length, n2.children.length)
				for (let i = 0; i < commonLength; i++) {
					patch(n1.children[i], n2.children[i])
				}

				if (n1.children.length > n2.children.length) {
					n1.children.slice(n2.children.length).forEach((child) => {
						unmount(child)
					})
				} else if (n2.children.length > n1.children.length) {
					n2.children.slice(n1.children.length).forEach((child) => {
						mount(child, n2.$el)
					})
				}
			}
		}
	}
}
