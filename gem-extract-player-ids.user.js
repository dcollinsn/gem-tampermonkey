// ==UserScript==
// @name         GEM Tournament Get Player IDs
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Copy GEM tournament player IDs
// @author       Dan Collins <dcollins@batwing.tech>
// @website      https://github.com/dcollinsn/gem-tampermonkey
// @updateURL    https://raw.githubusercontent.com/dcollinsn/gem-tampermonkey/main/gem-extract-player-ids.user.js
// @downloadURL  https://raw.githubusercontent.com/dcollinsn/gem-tampermonkey/main/gem-extract-player-ids.user.js
// @match        https://gem.fabtcg.com/gem/*/run/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fabtcg.com
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
    'use strict';

    function isDropped(el) {
        const $el = $(el);

        return $el.add($el.parents()).toArray().some((node) => {
            const style = window.getComputedStyle(node);
            return style.textDecorationLine.includes('line-through');
        });
    }

    function getPlayerIds(mode) {
        const rows = $('#registered_players')
            .nextAll('ol')
            .first()
            .find('.row');

        return rows
            .map(function () {
                const idCell = $(this).find('div:first-child').first();
                const idElement = idCell.find('span').first()[0] ?? idCell[0];

                const dropped = isDropped(idElement);

                if (mode === 'active' && dropped) return null;
                if (mode === 'dropped' && !dropped) return null;

                const match = idCell.text().trim().match(/\d+/);
                return match ? match[0] : null;
            })
            .get();
    }

    function copyIds(mode, label) {
        const ids = getPlayerIds(mode);

        GM_setClipboard(ids.join('\n'), 'text');

        alert(`Copied ${ids.length} ${label} player ID${ids.length === 1 ? '' : 's'} to clipboard.`);
    }

    GM_registerMenuCommand('Copy all player IDs', () => {
        copyIds('all', 'total');
    });

    GM_registerMenuCommand('Copy active player IDs', () => {
        copyIds('active', 'active');
    });

    GM_registerMenuCommand('Copy dropped player IDs', () => {
        copyIds('dropped', 'dropped');
    });
})();
