/**
 *
 * GraphVerse by Mark Smalley :: http://twitter.com/m_smalley
 * GitHub Repo :: https://github.com/msmalley/GraphVerse
 * License :: MIT
 *
 * Copyright (c) 2013 R1 DOT MY
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 *
 */

;(function ( $, window, document, undefined )
{
	// Create the defaults once
	var pluginName = "GraphVerse",
        defaults = {
            node: 0
        };

    // The actual plugin constructor
	function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

	Plugin.prototype = {

        init: function() {
			
            // Example = this.connect(this.element, this.options)

			var default_callback = this.callback;
			var put_contents = this.put;
			var get_contents = this.get;

			$('form.graphverse').each(function(i){
				$(this).on('submit', function(e){

					$this = $(this);

					action = $($this).attr('data-action');
					callback = $($this).attr('data-callback');

					if(!action) action = 'get';
					if(!callback) callback = default_callback;

					e.preventDefault();
					if(action == 'put')
					{
						var data = new Object();
						$($this).find('input.graph-text').each(function(i){
							data[$(this).attr('name')] = $(this).val();
						});
						put_contents(data, callback);
					}
					else if(action == 'get')
					{
						var node = $($this).find('input.graph-node').val()
						data = $($this).find('input.graph-data').val()
						get_contents(node, data, callback);
					}
				})
			});

        },

        get: function(node, data, callback) {
            // some logic
			var base_uri = 'http://localhost:7474';
			$.ajax({
				url: base_uri + '/db/data/node/' + parseInt(node) + '/',
				dataType: 'JSON',
				type: 'GET',
				success: function(results)
				{
					if(typeof window[callback] == 'function')
					{
						window[callback](results['data'][data]);
					}
					else
					{
						callback(results['data'][data]);
					}
				}
			})
        },

		put: function(data, callback) {
			var base_uri = 'http://localhost:7474';
			$.ajax({
				url: base_uri + '/db/data/node',
				dataType: 'JSON',
				type: 'POST',
				data: data,
				success: function(results)
				{
					if(typeof window[callback] == 'function')
					{
						window[callback](results['data']);
					}
					else
					{
						callback(results['data']);
					}
				}
			})
        },

		callback: function(results)
		{
			console.log(results);
		}
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };
})( jQuery, window, document );