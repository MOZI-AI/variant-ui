import React, { useRef, useEffect } from 'react';
const igv = require('igv')

const Visualizer = ({ }) => {
    const visualizerWrapper = useRef();

    useEffect(() => {
        var options =
        {
            genome: "hg19",
            locus: 'chr1:629,422-16,522,294',
            tracks:
                [
                    {
                        name: "Copy number",
                        type: "seg",
                        displayMode: "EXPANDED",
                        features: [
                            {
                                chr: "1",
                                start: 3218610,
                                end: 4749076,
                                value: -0.2239,
                                sample: "TCGA-OR-A5J2-01"
                            },
                            {
                                chr: "1",
                                start: 4750119,
                                end: 11347492,
                                value: -0.8391,
                                sample: "TCGA-OR-A5J2-01"
                            }
                        ]
                    },
                ]
        }; igv.createBrowser(visualizerWrapper.current, options)
            .then(function (browser) {
                console.log("Created IGV browser");
            })


    }, [])

    return <div ref={visualizerWrapper}></div>
}

export default Visualizer