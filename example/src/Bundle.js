/* @flow */
import type {BundleInterface} from "solfegejs/interface"

/**
 * Example bundle
 */
export default class Bundle implements BundleInterface
{
    /**
     * Constructor
     */
    constructor()
    {
    }

    /**
     * Get bundle path
     *
     * @return  {String}        The bundle path
     */
    getPath()
    {
        return __dirname;
    }
}

